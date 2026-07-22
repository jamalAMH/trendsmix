import {
  buildMetaDescription,
  buildMetaTitle,
  calculateReadTime,
  generateExcerpt,
  optimizePostContent,
  stripHtml,
} from "@/lib/content-cleanup";
import { isAiRewriteConfigured, rewritePostWithAi } from "@/lib/ai-rewrite";
import { deepRewritePost } from "@/lib/deep-rewrite";

export interface OptimizedPost {
  title: string;
  excerpt: string;
  content: string;
  meta_title: string;
  meta_description: string;
  read_time: number;
  aiRewritten: boolean;
}

export function optimizePostFree(
  title: string,
  content: string,
): OptimizedPost {
  // Prefer deep editorial rewrite (structure + rephrase) over light cleanup.
  const rewritten = deepRewritePost(title, content);
  return {
    title: rewritten.title,
    excerpt: rewritten.excerpt,
    content: rewritten.content,
    meta_title: rewritten.meta_title,
    meta_description: rewritten.meta_description,
    read_time: rewritten.read_time,
    aiRewritten: false,
  };
}

export async function optimizePost(
  title: string,
  content: string,
  excerpt: string,
  useAi = true,
): Promise<OptimizedPost> {
  const cleaned = optimizePostContent(title, content);

  if (useAi && isAiRewriteConfigured()) {
    const rewritten = await rewritePostWithAi(title, cleaned);
    if (rewritten) {
      const finalContent = optimizePostContent(rewritten.title, rewritten.content);
      const finalExcerpt =
        rewritten.excerpt || generateExcerpt(finalContent);
      return {
        title: rewritten.title,
        excerpt: finalExcerpt,
        content: finalContent,
        meta_title: buildMetaTitle(rewritten.title),
        meta_description: buildMetaDescription(finalContent, rewritten.title),
        read_time: calculateReadTime(finalContent),
        aiRewritten: true,
      };
    }
  }

  const finalExcerpt = generateExcerpt(cleaned);
  return {
    title,
    excerpt: finalExcerpt || excerpt,
    content: cleaned,
    meta_title: buildMetaTitle(title),
    meta_description: buildMetaDescription(cleaned, title),
    read_time: calculateReadTime(cleaned),
    aiRewritten: false,
  };
}

export function needsOptimization(content: string, excerpt: string): boolean {
  const lower = content.toLowerCase();
  return (
    lower.includes("dictionaries") ||
    lower.includes("continued on") ||
    lower.includes("facebook") ||
    lower.includes("editorial team |") ||
    !content.includes("<h2>") ||
    excerpt === stripHtml(content).slice(0, 160)
  );
}
