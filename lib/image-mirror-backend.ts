import type { SupabaseClient } from "@supabase/supabase-js";
import {
  mirrorHtmlViaEdge,
  mirrorUrlViaEdge,
  type MirrorAuth,
} from "@/lib/image-mirror-edge";
import {
  mirrorImageToStorage,
  mirrorImagesInHtml,
} from "@/lib/mirror-image";

export interface ImageMirrorBackend {
  mirrorUrl(url: string | null | undefined): Promise<string | null>;
  mirrorHtml(html: string): Promise<string>;
}

export function createDirectMirrorBackend(
  storage: SupabaseClient,
): ImageMirrorBackend {
  return {
    async mirrorUrl(url) {
      const trimmed = url?.trim() || null;
      if (!trimmed) return null;
      return mirrorImageToStorage(storage, trimmed);
    },
    mirrorHtml(html) {
      return mirrorImagesInHtml(storage, html);
    },
  };
}

export function createEdgeMirrorBackend(auth: MirrorAuth): ImageMirrorBackend {
  return {
    async mirrorUrl(url) {
      const trimmed = url?.trim() || null;
      if (!trimmed) return null;
      return mirrorUrlViaEdge(trimmed, auth);
    },
    mirrorHtml(html) {
      return mirrorHtmlViaEdge(html, auth);
    },
  };
}
