import type { ImageMirrorBackend } from "@/lib/image-mirror-backend";
import {
  isBrokenExternalImage,
  isHostedImage,
} from "@/lib/placeholder-image";

export type PreparePostImagesOptions = {
  /** When false, skip unmirrorable images instead of failing the request. */
  strict?: boolean;
};

const EXTERNAL_IMAGE_IN_HTML =
  /<img\b[^>]*\bsrc=["'](https?:\/\/[^"']+)["']/gi;

function collectExternalUrls(
  featuredImage: string | null | undefined,
  content: string,
  extraUrls: Array<string | null | undefined> = [],
): string[] {
  const urls = new Set<string>();

  if (featuredImage && !isHostedImage(featuredImage)) {
    urls.add(featuredImage.trim());
  }

  for (const extra of extraUrls) {
    if (extra && !isHostedImage(extra)) urls.add(extra.trim());
  }

  let match: RegExpExecArray | null;
  EXTERNAL_IMAGE_IN_HTML.lastIndex = 0;
  while ((match = EXTERNAL_IMAGE_IN_HTML.exec(content)) !== null) {
    const url = match[1];
    if (!isHostedImage(url)) urls.add(url);
  }

  return [...urls];
}

async function mirrorOptionalImage(
  backend: ImageMirrorBackend,
  url: string | null | undefined,
  strict: boolean,
): Promise<string | null> {
  const trimmed = url?.trim() || null;
  if (!trimmed) return null;
  if (isHostedImage(trimmed)) return trimmed;
  if (isBrokenExternalImage(trimmed)) return null;
  const mirrored = await backend.mirrorUrl(trimmed);
  if (!mirrored) {
    if (strict) {
      throw new Error(
        `Could not save image to storage: ${trimmed.slice(0, 80)}`,
      );
    }
    return null;
  }
  return mirrored;
}

export async function preparePostImages(
  backend: ImageMirrorBackend,
  featuredImage: string | null | undefined,
  content: string,
  extraUrls: Array<string | null | undefined> = [],
  options: PreparePostImagesOptions = {},
): Promise<{
  featuredImage: string | null;
  content: string;
  extras: Array<string | null>;
}> {
  const strict = options.strict ?? true;
  let nextFeatured = featuredImage?.trim() || null;
  let nextContent = content;

  nextFeatured = await mirrorOptionalImage(backend, nextFeatured, strict);
  nextContent = await backend.mirrorHtml(nextContent);

  const extras: Array<string | null> = [];
  for (const extra of extraUrls) {
    extras.push(await mirrorOptionalImage(backend, extra, strict));
  }

  const remaining = collectExternalUrls(nextFeatured, nextContent, extras).filter(
    (url) => !isBrokenExternalImage(url),
  );
  if (strict && remaining.length > 0) {
    throw new Error(
      "Some images could not be saved to Supabase storage. Check the media bucket and mirror-image function.",
    );
  }

  return { featuredImage: nextFeatured, content: nextContent, extras };
}

export function hasExternalImages(
  featuredImage: string | null | undefined,
  content: string,
  extraUrls: Array<string | null | undefined> = [],
): boolean {
  return collectExternalUrls(featuredImage, content, extraUrls).length > 0;
}
