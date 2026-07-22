import type { SupabaseClient } from "@supabase/supabase-js";

const MAX_BYTES = 10 * 1024 * 1024;
const FETCH_MS = 20_000;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
]);

function extensionForType(contentType: string): string {
  const base = contentType.split(";")[0].trim().toLowerCase();
  switch (base) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/gif":
      return "gif";
    case "image/webp":
      return "webp";
    case "image/avif":
      return "avif";
    default:
      return "jpg";
  }
}

function isAlreadyHosted(url: string, supabaseUrl: string): boolean {
  try {
    const host = new URL(url).hostname;
    return host.includes("supabase.co") || url.startsWith(supabaseUrl);
  } catch {
    return false;
  }
}

export async function mirrorImageToStorage(
  supabase: SupabaseClient,
  sourceUrl: string,
): Promise<string | null> {
  const supabaseOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const trimmed = sourceUrl.trim();
  if (!trimmed || isAlreadyHosted(trimmed, supabaseOrigin)) {
    return trimmed || null;
  }

  try {
    const res = await fetch(trimmed, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(FETCH_MS),
    });

    if (!res.ok) return null;

    const contentType = (res.headers.get("content-type") ?? "image/jpeg")
      .split(";")[0]
      .trim()
      .toLowerCase();

    if (!ALLOWED_TYPES.has(contentType)) return null;

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length === 0 || buffer.length > MAX_BYTES) return null;

    const ext = extensionForType(contentType);
    const path = `imports/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { data, error } = await supabase.storage
      .from("media")
      .upload(path, buffer, { contentType, upsert: false });

    if (error) return null;

    const {
      data: { publicUrl },
    } = supabase.storage.from("media").getPublicUrl(data.path);

    return publicUrl;
  } catch {
    return null;
  }
}

export async function mirrorImagesInHtml(
  supabase: SupabaseClient,
  html: string,
): Promise<string> {
  const imgRegex = /<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;
  const urls = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = imgRegex.exec(html)) !== null) {
    urls.add(match[1]);
  }

  if (urls.size === 0) return html;

  const replacements = new Map<string, string>();
  for (const url of urls) {
    const mirrored = await mirrorImageToStorage(supabase, url);
    if (mirrored && mirrored !== url) {
      replacements.set(url, mirrored);
    }
  }

  if (replacements.size === 0) return html;

  let updated = html;
  for (const [from, to] of replacements) {
    updated = updated.split(from).join(to);
  }
  return updated;
}
