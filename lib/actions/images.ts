"use server";

import { revalidatePath } from "next/cache";
import {
  createDirectMirrorBackend,
  createEdgeMirrorBackend,
  type ImageMirrorBackend,
} from "@/lib/image-mirror-backend";
import {
  isBrokenExternalImage,
  isHostedImage,
  placeholderImageUrl,
} from "@/lib/placeholder-image";
import { getAdminMirrorAuth } from "@/lib/actions/mirror-auth";
import { isImageStorageConfigured } from "@/lib/post-images";
import { createServiceClient } from "@/lib/supabase/service";
import { requireAdmin } from "./helpers";

export type FixImagesResult =
  | { ok: true; updated: number; skipped: number }
  | { ok: false; error: string };

const FBCDN_IN_HTML =
  /https?:\/\/[^"'\s>]*fbcdn\.net[^"'\s>]*/gi;

async function resolveMirrorBackend(): Promise<ImageMirrorBackend | null> {
  const storage = createServiceClient();
  if (storage) return createDirectMirrorBackend(storage);

  const auth = await getAdminMirrorAuth();
  if (auth) return createEdgeMirrorBackend(auth);

  return null;
}

async function resolveFeaturedImage(
  backend: ImageMirrorBackend,
  current: string | null,
  slug: string,
): Promise<string> {
  if (current && isHostedImage(current) && !isBrokenExternalImage(current)) {
    const mirrored = await backend.mirrorUrl(current);
    if (mirrored) return mirrored;
    if (current.includes("supabase.co")) return current;
  }

  if (current && !isBrokenExternalImage(current)) {
    const mirrored = await backend.mirrorUrl(current);
    if (mirrored) return mirrored;
  }

  const placeholder = placeholderImageUrl(slug);
  return (await backend.mirrorUrl(placeholder)) ?? placeholder;
}

async function resolveContentHtml(
  backend: ImageMirrorBackend,
  html: string,
  slug: string,
): Promise<string> {
  let content = html;

  if (FBCDN_IN_HTML.test(content)) {
    content = content.replace(
      FBCDN_IN_HTML,
      placeholderImageUrl(`${slug}-body`),
    );
  }

  return backend.mirrorHtml(content);
}

export async function fixBrokenPostImages(): Promise<FixImagesResult> {
  try {
    if (!isImageStorageConfigured()) {
      return {
        ok: false,
        error: "Image storage is not configured. Deploy mirror-image on Supabase.",
      };
    }

    const backend = await resolveMirrorBackend();
    if (!backend) {
      return {
        ok: false,
        error: "Could not authenticate for image storage. Sign in again as admin.",
      };
    }

    const { supabase } = await requireAdmin();
    const { data: posts, error } = await supabase
      .from("posts")
      .select("id, slug, featured_image, content");

    if (error) throw new Error(error.message);

    let updated = 0;
    let skipped = 0;

    for (const post of posts ?? []) {
      const needsFeatured =
        isBrokenExternalImage(post.featured_image) ||
        (post.featured_image &&
          !post.featured_image.includes("supabase.co") &&
          !post.featured_image.includes("picsum.photos"));
      const needsContent = FBCDN_IN_HTML.test(post.content ?? "");

      if (!needsFeatured && !needsContent) {
        skipped++;
        continue;
      }

      const featured_image = needsFeatured
        ? await resolveFeaturedImage(
            backend,
            post.featured_image,
            post.slug as string,
          )
        : post.featured_image;

      const content = needsContent
        ? await resolveContentHtml(
            backend,
            post.content as string,
            post.slug as string,
          )
        : post.content;

      const { error: updateError } = await supabase
        .from("posts")
        .update({ featured_image, content })
        .eq("id", post.id);

      if (updateError) throw new Error(updateError.message);
      updated++;
    }

    revalidatePath("/", "layout");
    revalidatePath("/stories");
    revalidatePath("/sitemap.xml");
    revalidatePath("/feed.xml");

    return { ok: true, updated, skipped };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to fix images.",
    };
  }
}
