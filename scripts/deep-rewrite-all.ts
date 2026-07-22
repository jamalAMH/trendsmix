import { createClient } from "@supabase/supabase-js";
import { deepRewritePost } from "../lib/deep-rewrite";

const url = process.env.SUPABASE_URL!;
const key = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(url, key);

async function main() {
  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, slug, title, content")
    .order("published_at", { ascending: true });

  if (error) {
    console.error(error.message);
    process.exit(1);
  }

  let updated = 0;
  let failed = 0;

  for (const post of posts ?? []) {
    try {
      const r = deepRewritePost(post.title as string, post.content as string);
      const { error: rpcError } = await supabase.rpc("optimize_post_fields", {
        p_id: post.id,
        p_title: r.title,
        p_excerpt: r.excerpt,
        p_content: r.content,
        p_meta_title: r.meta_title,
        p_meta_description: r.meta_description,
        p_read_time: r.read_time,
      });
      if (rpcError) throw new Error(rpcError.message);
      updated++;
      console.log(`OK ${post.slug}`);
    } catch (e) {
      failed++;
      console.error(`FAIL ${post.slug}`, e instanceof Error ? e.message : e);
    }
  }

  console.log(`Done. Updated=${updated} Failed=${failed}`);
}

main();
