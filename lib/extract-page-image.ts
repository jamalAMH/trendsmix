import { isBrokenExternalImage } from "@/lib/placeholder-image";

const FETCH_MS = 20_000;
const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const OG_IMAGE_RE =
  /<meta[^>]+(?:property=["']og:image(?::url)?["'][^>]+content=["']([^"']+)["']|content=["']([^"']+)["'][^>]+property=["']og:image(?::url)?["'])[^>]*>/i;

const IMG_SRC_RE = /<img[^>]+src=["']([^"']+)["']/gi;

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function normalizeImageUrl(src: string): string | null {
  const trimmed = decodeHtmlEntities(src.trim());
  if (!trimmed || trimmed.startsWith("data:")) return null;

  const url = trimmed.startsWith("//") ? `https:${trimmed}` : trimmed;
  if (!/^https?:\/\//i.test(url)) return null;

  const lower = url.toLowerCase();
  if (
    lower.includes("histats.com") ||
    lower.includes("pixel") ||
    lower.includes("spacer.gif") ||
    (lower.endsWith(".gif") && !lower.includes("wp-content"))
  ) {
    return null;
  }

  if (isBrokenExternalImage(url)) return null;
  return url;
}

function scoreImageUrl(url: string): number {
  const lower = url.toLowerCase();
  let score = 0;

  if (lower.includes("wp-content/uploads")) score += 120;
  else if (lower.includes("wp-content")) score += 80;
  if (lower.includes("googleusercontent.com")) score += 40;
  if (/-\d+x\d+\./.test(lower)) score -= 60;
  if (/\.(jpe?g|png|webp|avif)(\?|$)/i.test(lower)) score += 15;

  return score;
}

export function extractImageFromHtml(html: string): string | null {
  const og = html.match(OG_IMAGE_RE);
  const ogUrl = og?.[1] || og?.[2];
  if (ogUrl?.trim()) {
    const normalized = normalizeImageUrl(ogUrl);
    if (normalized) return normalized;
  }

  const candidates: string[] = [];
  let match: RegExpExecArray | null;
  IMG_SRC_RE.lastIndex = 0;

  while ((match = IMG_SRC_RE.exec(html)) !== null) {
    const normalized = normalizeImageUrl(match[1]);
    if (normalized) candidates.push(normalized);
  }

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => scoreImageUrl(b) - scoreImageUrl(a));
  return candidates[0] ?? null;
}

export async function fetchImageUrlFromPage(
  pageUrl: string,
): Promise<string | null> {
  const trimmed = pageUrl.trim();
  if (!trimmed) return null;

  try {
    const res = await fetch(trimmed, {
      headers: {
        "User-Agent": BROWSER_UA,
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(FETCH_MS),
    });

    if (!res.ok) return null;

    const html = await res.text();
    return extractImageFromHtml(html);
  } catch {
    return null;
  }
}
