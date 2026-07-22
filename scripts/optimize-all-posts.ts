/**
 * One-off bulk optimizer — run with: npx tsx scripts/optimize-all-posts.ts
 * Uses SUPABASE_SERVICE_ROLE_KEY or falls back to MCP-style direct SQL via service client.
 */
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import { optimizePostFree } from "../lib/post-optimizer";

function loadEnv() {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const key = serviceKey || anonKey;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or Supabase key in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key);

async function main() {
  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, slug, title, excerpt, content")
    .order("published_at", { ascending: true });

  if (error) {
    console.error("Fetch failed:", error.message);
    process.exit(1);
  }

  console.log(`Optimizing ${posts?.length ?? 0} posts…`);

  let updated = 0;
  let failed = 0;

  for (const post of posts ?? []) {
    try {
      const optimized = optimizePostFree(
        post.title as string,
        post.content as string,
      );

      const { error: updateError } = await supabase
        .from("posts")
        .update({
          title: optimized.title,
          excerpt: optimized.excerpt,
          content: optimized.content,
          meta_title: optimized.meta_title,
          meta_description: optimized.meta_description,
          read_time: optimized.read_time,
        })
        .eq("id", post.id);

      if (updateError) throw new Error(updateError.message);
      updated++;
      if (updated % 20 === 0) {
        console.log(`  ${updated}/${posts?.length} done…`);
      }
    } catch (e) {
      failed++;
      console.error(`  FAIL ${post.slug}:`, e instanceof Error ? e.message : e);
    }
  }

  console.log(`Done. Updated: ${updated}, Failed: ${failed}`);
}

main();
