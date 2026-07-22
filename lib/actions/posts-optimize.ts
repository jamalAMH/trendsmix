"use server";

import { revalidatePath } from "next/cache";
import { isAiRewriteConfigured } from "@/lib/ai-rewrite";
import { optimizePost, optimizePostFree } from "@/lib/post-optimizer";
import { requireAdmin } from "./helpers";

export type OptimizePostsResult =
  | {
      ok: true;
      processed: number;
      updated: number;
      skipped: number;
      offset: number;
      total: number;
      hasMore: boolean;
      aiUsed: boolean;
    }
  | { ok: false; error: string };

export async function optimizePostsBatch(
  offset = 0,
  batchSize = 3,
  useAi = true,
): Promise<OptimizePostsResult> {
  try {
    const { supabase } = await requireAdmin();

    const { count, error: countError } = await supabase
      .from("posts")
      .select("id", { count: "exact", head: true });

    if (countError) throw new Error(countError.message);

    const total = count ?? 0;
    const { data: posts, error } = await supabase
      .from("posts")
      .select("id, title, excerpt, content")
      .order("published_at", { ascending: true })
      .range(offset, offset + batchSize - 1);

    if (error) throw new Error(error.message);

    let updated = 0;
    let skipped = 0;
    const aiUsed = useAi && isAiRewriteConfigured();

    for (const post of posts ?? []) {
      try {
        const optimized = useAi
          ? await optimizePost(
              post.title as string,
              post.content as string,
              (post.excerpt as string) ?? "",
              true,
            )
          : optimizePostFree(
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
      } catch {
        skipped++;
      }
    }

    const processed = (posts ?? []).length;
    const nextOffset = offset + processed;

    if (nextOffset >= total && updated > 0) {
      revalidatePath("/", "layout");
      revalidatePath("/stories");
      revalidatePath("/sitemap.xml");
      revalidatePath("/feed.xml");
    }

    return {
      ok: true,
      processed,
      updated,
      skipped,
      offset: nextOffset,
      total,
      hasMore: nextOffset < total,
      aiUsed,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to optimize posts.",
    };
  }
}

export async function getOptimizeStatus(): Promise<{
  total: number;
  aiConfigured: boolean;
}> {
  const { supabase } = await requireAdmin();
  const { count } = await supabase
    .from("posts")
    .select("id", { count: "exact", head: true });

  return {
    total: count ?? 0,
    aiConfigured: isAiRewriteConfigured(),
  };
}
