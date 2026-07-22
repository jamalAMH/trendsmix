/**
 * Fix draft posts (risky/scraped), rewrite for fiction site, then publish.
 * Run: npx tsx scripts/fix-and-publish-drafts.ts
 */
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import { deepRewritePost } from "../lib/deep-rewrite";
import { stripHtml } from "../lib/content-cleanup";

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
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Missing Supabase URL/key in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key);
const DRAMA_CATEGORY = "53012e13-a11e-4648-82d3-958eef7c7efe";

/** Map risky/clickbait titles → fiction-safe titles */
const TITLE_RULES: Array<{ test: RegExp; title: string }> = [
  { test: /blood clot/i, title: "The Warning She Almost Ignored" },
  { test: /month before a stroke/i, title: "The Month Before Everything Changed" },
  { test: /copper water/i, title: "The Copper Vessel on Her Shelf" },
  { test: /visible veins/i, title: "What the Mirror Would Not Hide" },
  { test: /salivation/i, title: "The Night Her Body Would Not Rest" },
  { test: /white spots/i, title: "Marks She Could Not Explain" },
  { test: /bleach stains/i, title: "The Stain That Would Not Leave" },
  { test: /charger use/i, title: "The Charger on the Kitchen Counter" },
  { test: /colors you should never wear|funeral/i, title: "Colors She Refused to Wear" },
  { test: /jd vance/i, title: "The Confirmation That Split the Room" },
  { test: /will smith/i, title: "The Rumor That Would Not Die" },
  { test: /major storm/i, title: "When the Sky Turned Against Them" },
  { test: /earthquake/i, title: "The Tremor That Woke the City" },
  { test: /teen sentenced/i, title: "The Sentence That Shocked Everyone" },
  { test: /bathed with my husband/i, title: "The Bathroom Door She Finally Locked" },
  { test: /jerry springer/i, title: "The Child Everyone Talked About" },
  { test: /what to let go/i, title: "Seven Things She Left Behind" },
];

function fictionTitle(raw: string): string {
  for (const rule of TITLE_RULES) {
    if (rule.test.test(raw)) return rule.title;
  }
  return raw
    .replace(/\b(see moree?|foodix|weeknight bites|meal ideas|daily recipes|smart recipe|kitchen flow|yum guide|secret food|check the comments)\b/gi, "")
    .replace(/[👇…\.]+$/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+[–—-]\s*$/g, "")
    .trim();
}

/** Prefer longer content when duplicates share a fiction title */
function dedupeKey(title: string): string {
  return fictionTitle(title).toLowerCase();
}

async function main() {
  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, slug, title, content, excerpt")
    .eq("status", "draft")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Fetch failed:", error.message);
    process.exit(1);
  }

  console.log(`Drafts found: ${posts?.length ?? 0}`);

  const bestByTitle = new Map<string, (typeof posts)[number]>();
  const skipIds = new Set<string>();

  for (const post of posts ?? []) {
    const keyTitle = dedupeKey(post.title as string);
    const existing = bestByTitle.get(keyTitle);
    const len = stripHtml(String(post.content ?? "")).length;
    if (!existing) {
      bestByTitle.set(keyTitle, post);
      continue;
    }
    const existingLen = stripHtml(String(existing.content ?? "")).length;
    if (len > existingLen) {
      skipIds.add(existing.id as string);
      bestByTitle.set(keyTitle, post);
    } else {
      skipIds.add(post.id as string);
    }
  }

  let published = 0;
  let skipped = 0;
  let failed = 0;

  for (const post of posts ?? []) {
    if (skipIds.has(post.id as string)) {
      skipped++;
      console.log(`SKIP duplicate ${post.slug}`);
      continue;
    }

    try {
      const newTitle = fictionTitle(post.title as string);
      const rewritten = deepRewritePost(newTitle, post.content as string);

      const { error: updateError } = await supabase
        .from("posts")
        .update({
          title: rewritten.title,
          excerpt: rewritten.excerpt,
          content: rewritten.content,
          meta_title: rewritten.meta_title,
          meta_description: rewritten.meta_description,
          read_time: rewritten.read_time,
          category_id: DRAMA_CATEGORY,
          status: "published",
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", post.id);

      if (updateError) throw new Error(updateError.message);
      published++;
      console.log(`PUBLISHED ${rewritten.title}`);
    } catch (e) {
      failed++;
      console.error(`FAIL ${post.slug}`, e instanceof Error ? e.message : e);
    }
  }

  console.log(
    `Done. Published=${published} SkippedDuplicates=${skipped} Failed=${failed}`,
  );
}

main();
