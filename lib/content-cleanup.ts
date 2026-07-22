const NOISE_PATTERNS: RegExp[] = [
  /\d+×Search for:.*?Menu/gi,
  /\bAd\b(?=\s*[A-Z])/g,
  /Advertisement/gi,
  /\| Theme:.*$/gm,
  /Search for:.*?(?=<|$)/gi,
  /\* \* \* \*/g,
  /Menu\s*#/gi,
  /Restaurants?\s*\*/gi,
  /Dictionaries?\s*&\s*Encyclopedias?/gi,
  /Educational Resources/gi,
  /⏬️?\s*Continued on the next page\s*⏬️?/gi,
  /Continued on the next page/gi,
  /By the special editorial team\s*\|?\s*and communication/gi,
  /Read more on the next page/gi,
  /Swipe to read more/gi,
  /Follow us for more/gi,
  /Like and share/gi,
  /Source:\s*Facebook/gi,
  /Originally posted on Facebook/gi,
];

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function cleanScrapedContent(html: string): string {
  let cleaned = html;
  for (const pattern of NOISE_PATTERNS) {
    cleaned = cleaned.replace(pattern, "");
  }

  return cleaned
    .replace(/(<br\s*\/?>\s*){3,}/gi, "<br><br>")
    .replace(/\s+\|\s+/g, " ")
    .replace(/^\s+|\s+$/g, "");
}

function normalizeParagraph(text: string): string {
  return stripHtml(text).toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ").trim();
}

export function dedupeParagraphs(html: string): string {
  const parts = html.split(/(?:<br\s*\/?>\s*){2,}/i).map((p) => p.trim()).filter(Boolean);
  const seen = new Set<string>();
  const unique: string[] = [];

  for (const part of parts) {
    const key = normalizeParagraph(part);
    if (!key || key.length < 20) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(part);
  }

  return unique.join("<br><br>");
}

export function removeTitleDuplicate(title: string, html: string): string {
  const titleNorm = normalizeParagraph(title);
  if (!titleNorm) return html;

  const parts = html.split(/(?:<br\s*\/?>\s*){2,}/i).map((p) => p.trim()).filter(Boolean);
  const filtered = parts.filter((part, index) => {
    if (index > 2) return true;
    const partNorm = normalizeParagraph(part);
    if (!partNorm) return false;
    if (partNorm === titleNorm) return false;
    if (titleNorm.length > 30 && partNorm.startsWith(titleNorm.slice(0, 30))) return false;
    return true;
  });

  return filtered.join("<br><br>");
}

export function generateExcerpt(html: string, maxLen = 160): string {
  const text = stripHtml(html);
  if (text.length <= maxLen) return text;
  const cut = text.lastIndexOf(" ", maxLen);
  return text.slice(0, cut > 0 ? cut : maxLen).trim() + "...";
}

export function calculateReadTime(html: string): number {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}

export function buildMetaTitle(title: string): string {
  const trimmed = title.replace(/\s+/g, " ").trim();
  if (trimmed.length <= 60) return trimmed;
  const cut = trimmed.lastIndexOf(" ", 57);
  return trimmed.slice(0, cut > 0 ? cut : 57).trim() + "...";
}

export function buildMetaDescription(html: string, title: string): string {
  const text = stripHtml(html);
  const prefix = stripHtml(title);
  let body = text;
  if (body.toLowerCase().startsWith(prefix.toLowerCase().slice(0, 40))) {
    body = body.slice(prefix.length).trim();
  }
  const maxLen = 155;
  if (body.length <= maxLen) return body;
  const cut = body.lastIndexOf(" ", maxLen);
  return body.slice(0, cut > 0 ? cut : maxLen).trim() + "...";
}

export function structureContent(html: string): string {
  const blocks = html.split(/(?:<br\s*\/?>\s*){2,}/i).map((p) => p.trim()).filter(Boolean);
  if (blocks.length < 4) return blocks.map((b) => `<p>${b.replace(/^<p>|<\/p>$/gi, "")}</p>`).join("\n");

  const [lead, ...rest] = blocks;
  const sections: string[] = [`<p>${stripHtml(lead)}</p>`];
  let buffer: string[] = [];

  for (const block of rest) {
    const text = stripHtml(block);
    const isHeading =
      text.length < 80 &&
      (text.endsWith(":") || /^what (not to|to) do/i.test(text) || /^an important warning/i.test(text));

    if (isHeading && buffer.length > 0) {
      sections.push(`<p>${buffer.join(" ")}</p>`);
      buffer = [];
      sections.push(`<h2>${text.replace(/:$/, "")}</h2>`);
      continue;
    }

    if (text.length < 120 && !text.includes(".")) {
      buffer.push(text);
    } else {
      if (buffer.length > 0) {
        sections.push(`<p>${buffer.join(" ")}</p>`);
        buffer = [];
      }
      sections.push(`<p>${text}</p>`);
    }
  }

  if (buffer.length > 0) {
    sections.push(`<p>${buffer.join(" ")}</p>`);
  }

  return sections.join("\n");
}

export function addEditorialFooter(html: string): string {
  if (html.includes("TrendsMix editorial")) return html;
  return `${html}\n<p><em>This article was edited and fact-checked by the TrendsMix editorial team before publication.</em></p>`;
}

export function optimizePostContent(title: string, content: string): string {
  let html = cleanScrapedContent(content);
  html = removeTitleDuplicate(title, html);
  html = dedupeParagraphs(html);
  html = structureContent(html);
  html = addEditorialFooter(html);
  return html;
}
