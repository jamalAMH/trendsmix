/**
 * Free cleanup for incoming n8n posts: strips filler/CTA lines and splits the text into
 * paragraphs. It does NOT make content original — every post must be reviewed and
 * rewritten by an editor before it is published.
 */
import {
  buildMetaDescription,
  buildMetaTitle,
  calculateReadTime,
  generateExcerpt,
  stripHtml,
} from "./content-cleanup";

const FILLER =
  /\b(see more|continued on|next page|swipe|like and share|check the comments|recipe corner|weeknight bites|kitchen flow|yum guide|smart recipe|meal ideas|daily recipes|secret food|foodix|best recipes|recipe lab)\b/gi;

function cleanTitle(title: string): string {
  return title
    .replace(FILLER, "")
    .replace(/[.…]+$/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+–\s*$/g, "")
    .trim()
    .replace(/^(.{8,90}?)\s+\S*$/, (m) => (m.length > 70 ? m.slice(0, 67).replace(/\s+\S*$/, "") + "…" : m));
}

function sentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 25)
    .filter(
      (s) =>
        !/cookie|privacy settings|newsletter|subscribe|author001|facebook friends|advertisement/i.test(
          s,
        ),
    );
}

function chunkToSections(sents: string[], title: string): string {
  if (sents.length === 0) {
    return `<p>This TrendsMix story — <strong>${title}</strong> — is being prepared for publication.</p>`;
  }

  // Keep the source sentences intact. Mechanical word swaps ("I was" -> "I found
  // myself") and boilerplate headings ("The story begins") produced unnatural text
  // that reads as auto-generated and hurts AdSense review. Posts now land as drafts
  // so an editor can rewrite them properly before publishing.
  return sents.map((s) => `<p>${s}</p>`).join("\n");
}

export function deepRewritePost(title: string, content: string) {
  const newTitle = cleanTitle(title) || title.trim();
  const plain = stripHtml(content);
  const sents = sentences(plain);
  // Drop first sentence if it is the old TrendsMix intro
  const bodySents = sents.filter((s) => !s.includes("At TrendsMix, we unpack"));
  const html = chunkToSections(bodySents, newTitle);
  const excerpt = generateExcerpt(html, 155);
  return {
    title: newTitle,
    excerpt,
    content: html,
    meta_title: buildMetaTitle(newTitle),
    meta_description: buildMetaDescription(html, newTitle),
    read_time: calculateReadTime(html),
  };
}
