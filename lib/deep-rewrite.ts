/**
 * Deep free rewrite — transforms scraped posts into TrendsMix-original editorial articles
 * without an external AI API. Not perfect Copyscape-proof, but far more original than cleanup.
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

function rephrase(s: string): string {
  let t = s
    .replace(/\bI was\b/g, "I found myself")
    .replace(/\bHe said\b/g, "He told me")
    .replace(/\bShe said\b/g, "She told me")
    .replace(/\bThen\b/g, "After that")
    .replace(/\bSuddenly\b/g, "Without warning")
    .replace(/\bHowever,\b/g, "Still,")
    .replace(/\bIndeed,\b/g, "In practice,")
    .replace(/\bMoreover,\b/g, "On top of that,")
    .replace(/\bBasically,\b/g, "")
    .replace(/\bJust like that,\b/g, "In that moment,")
    .replace(/\bIt is important to\b/gi, "Readers should")
    .replace(/\bYou should know\b/gi, "It helps to know")
    .replace(/\bIn this article,?\s*/gi, "")
    .replace(/\bMany people\b/gi, "Plenty of readers")
    .replace(/\bAccording to\b/gi, "As reported by");
  return t.replace(/\s{2,}/g, " ").trim();
}

function chunkToSections(sents: string[], title: string): string {
  if (sents.length === 0) {
    return `<p>This TrendsMix story — <strong>${title}</strong> — is being prepared for publication.</p>`;
  }

  const mid = Math.max(2, Math.floor(sents.length / 3));
  const part1 = sents.slice(0, mid).map(rephrase);
  const part2 = sents.slice(mid, mid * 2).map(rephrase);
  const part3 = sents.slice(mid * 2).map(rephrase);

  const sections: string[] = [];

  sections.push(`<h2>The story begins</h2>`);
  for (const s of part1) sections.push(`<p>${s}</p>`);

  if (part2.length) {
    sections.push(`<h2>The turning point</h2>`);
    for (const s of part2) sections.push(`<p>${s}</p>`);
  }

  if (part3.length) {
    sections.push(`<h2>What came next</h2>`);
    for (const s of part3) sections.push(`<p>${s}</p>`);
  }

  sections.push(
    `<p><em>Originally published on TrendsMix.</em></p>`,
  );

  return sections.join("\n");
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
