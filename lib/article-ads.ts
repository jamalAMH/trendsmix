/**
 * Splits article HTML into chunks so ad codes (from Admin → Settings → Code & Plugins)
 * can be placed between paragraphs. Only top-level paragraph ends are used as split
 * points, so lists, quotes and tables are never cut in half.
 */
function topLevelParagraphEnds(html: string): number[] {
  const ends: number[] = [];
  const re = /<(\/?)(p|blockquote|ul|ol|table|figure)\b[^>]*>/gi;
  let depth = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const closing = m[1] === "/";
    const tag = m[2].toLowerCase();
    if (tag === "p") {
      if (closing && depth === 0) ends.push(m.index + m[0].length);
      continue;
    }
    depth = Math.max(0, depth + (closing ? -1 : 1));
  }
  return ends;
}

export type ArticlePart =
  | { type: "html"; html: string }
  | { type: "ad"; code: string; key: string };

/**
 * Returns the article as html chunks with ads inserted:
 * - `first` after the 2nd paragraph
 * - `second` around 60% of the article (only if it lands after `first`)
 */
export function splitArticleForAds(
  html: string,
  first: string,
  second: string,
): ArticlePart[] {
  const ends = topLevelParagraphEnds(html);
  const cuts: Array<{ at: number; code: string; key: string }> = [];

  if (first && ends.length >= 3) {
    cuts.push({ at: ends[1], code: first, key: "in-article-1" });
  }
  if (second && ends.length >= 6) {
    const idx = Math.floor(ends.length * 0.6);
    const at = ends[idx];
    if (!cuts.length || at > cuts[0].at) {
      cuts.push({ at, code: second, key: "in-article-2" });
    }
  }

  if (!cuts.length) return [{ type: "html", html }];

  const parts: ArticlePart[] = [];
  let pos = 0;
  for (const cut of cuts) {
    parts.push({ type: "html", html: html.slice(pos, cut.at) });
    parts.push({ type: "ad", code: cut.code, key: cut.key });
    pos = cut.at;
  }
  parts.push({ type: "html", html: html.slice(pos) });
  return parts;
}
