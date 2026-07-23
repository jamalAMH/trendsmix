import {
  createDirectMirrorBackend,
  createEdgeMirrorBackend,
} from "@/lib/image-mirror-backend";
import {
  defaultMirrorAuth,
  isEdgeMirrorAvailable,
} from "@/lib/image-mirror-edge";
import {
  preparePostImages,
  type PreparePostImagesOptions,
} from "@/lib/prepare-post-images";
import type { MirrorAuth } from "@/lib/image-mirror-edge";
import { createServiceClient } from "@/lib/supabase/service";

export function isImageStorageConfigured(): boolean {
  // Direct upload (service role) OR Edge Function reachable with an API key
  return (
    !!createServiceClient() ||
    (isEdgeMirrorAvailable() && !!defaultMirrorAuth())
  );
}

function resolveMirrorBackend(auth?: MirrorAuth | null) {
  const storage = createServiceClient();
  if (storage) return createDirectMirrorBackend(storage);

  const mirrorAuth = auth ?? defaultMirrorAuth();
  if (mirrorAuth && isEdgeMirrorAvailable()) {
    return createEdgeMirrorBackend(mirrorAuth);
  }

  // Edge URL exists but auth missing — still try with whatever auth was passed
  if (mirrorAuth && !!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return createEdgeMirrorBackend(mirrorAuth);
  }

  return null;
}

export async function persistPostImages(
  featuredImage: string | null | undefined,
  content: string,
  extraUrls: Array<string | null | undefined> = [],
  auth?: MirrorAuth | null,
  options?: PreparePostImagesOptions,
): Promise<{
  featuredImage: string | null;
  content: string;
  extras: Array<string | null>;
}> {
  const backend = resolveMirrorBackend(auth);
  if (!backend) {
    throw new Error(
      "Image storage is not configured. Deploy the mirror-image Supabase function or add SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return preparePostImages(
    backend,
    featuredImage,
    content,
    extraUrls,
    options,
  );
}
