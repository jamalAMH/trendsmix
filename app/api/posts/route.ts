import { NextResponse } from "next/server";
import { verifyApiKey } from "@/lib/api-auth";
import { fetchImageUrlFromPage } from "@/lib/extract-page-image";
import { hasExternalImages } from "@/lib/prepare-post-images";
import { optimizePostFree } from "@/lib/post-optimizer";
import {
  isImageStorageConfigured,
  persistPostImages,
} from "@/lib/post-images";
import { defaultMirrorAuth } from "@/lib/image-mirror-edge";
import {
  isHostedImage,
  placeholderImageUrl,
} from "@/lib/placeholder-image";
import { revalidateStoryPaths } from "@/lib/revalidate-stories";
import { isN8nEnabled } from "@/lib/settings";
import { createClient } from "@supabase/supabase-js";

interface CreatePostBody {
  title: string;
  article_content: string;
  image?: string;
  post_image?: string;
  url?: string;
  "url image"?: string;
  comment_links?: string;
  page_url?: string;
}

function resolveN8nImage(body: CreatePostBody): string | null {
  return (
    body.image?.trim() ||
    body.post_image?.trim() ||
    body.url?.trim() ||
    body["url image"]?.trim() ||
    null
  );
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Missing Supabase environment variables.");
  }
  return createClient(url, key);
}

export async function POST(request: Request) {
  const authError = verifyApiKey(request);
  if (authError) return authError;

  if (!(await isN8nEnabled())) {
    return NextResponse.json(
      { error: "n8n auto-publish is disabled in Control Center." },
      { status: 503 },
    );
  }

  let body: CreatePostBody;
  try {
    body = (await request.json()) as CreatePostBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.title?.trim()) {
    return NextResponse.json({ error: "title is required." }, { status: 400 });
  }

  if (!body.article_content?.trim()) {
    return NextResponse.json(
      { error: "article_content is required." },
      { status: 400 },
    );
  }

  const apiKey = process.env.N8N_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "N8N_API_KEY is not configured on the server." },
      { status: 503 },
    );
  }

  const title = body.title.trim();
  let preparedContent = body.article_content;
  const pageUrl = body.comment_links?.trim() || body.page_url?.trim() || null;

  let rawImage = resolveN8nImage(body);
  if (!rawImage && pageUrl) {
    rawImage = await fetchImageUrlFromPage(pageUrl);
  }
  if (!rawImage) {
    rawImage = placeholderImageUrl(title);
  }

  // Permanent storage is required for any external image — never keep CDN URLs in DB
  if (hasExternalImages(rawImage, preparedContent) && !isImageStorageConfigured()) {
    return NextResponse.json(
      {
        error:
          "Image storage is not configured. Set N8N_API_KEY on the server and deploy the mirror-image Supabase function (or SUPABASE_SERVICE_ROLE_KEY).",
      },
      { status: 503 },
    );
  }

  let featuredImage = rawImage;
  let imagesMirrored = false;

  if (hasExternalImages(rawImage, preparedContent)) {
    try {
      const apiKeyHeader = request.headers.get("x-api-key");
      const authHeader = request.headers.get("authorization");
      const providedKey =
        apiKeyHeader?.trim() ||
        (authHeader?.startsWith("Bearer ")
          ? authHeader.slice(7).trim()
          : null);
      const mirrorAuth =
        (providedKey ? ({ type: "api-key" as const, key: providedKey }) : null) ??
        defaultMirrorAuth();

      const prepared = await persistPostImages(
        rawImage,
        preparedContent,
        [],
        mirrorAuth,
        { strict: true },
      );

      featuredImage = prepared.featuredImage ?? placeholderImageUrl(title);
      preparedContent = prepared.content;
      imagesMirrored = true;
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Failed to save images to Supabase storage.",
        },
        { status: 502 },
      );
    }
  }

  // Safety net: never persist a non-hosted featured image
  if (!featuredImage || !isHostedImage(featuredImage)) {
    featuredImage = placeholderImageUrl(title);
  }

  const optimized = optimizePostFree(title, preparedContent);

  const supabase = getSupabase();
  const { data, error } = await supabase.rpc("publish_post_n8n", {
    p_api_key: apiKey,
    p_title: optimized.title,
    p_content: optimized.content,
    p_slug: null,
    p_excerpt: optimized.excerpt,
    p_category_slug: null,
    p_status: "published",
    p_featured: false,
    p_read_time: optimized.read_time,
    p_featured_image: featuredImage,
    p_featured_image_alt: "",
    p_meta_title: optimized.meta_title,
    p_meta_description: optimized.meta_description,
    p_canonical_url: null,
    p_og_image: null,
  });

  if (error) {
    const message = error.message;
    if (message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (message.includes("already exists")) {
      return NextResponse.json({ error: message }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const post = data as {
    id: string;
    slug: string;
    title: string;
    status: string;
    published_at: string | null;
  };

  revalidateStoryPaths(post.slug);

  return NextResponse.json(
    {
      ok: true,
      post,
      url: `/stories/${post.slug}`,
      images_mirrored: imagesMirrored,
      featured_image: featuredImage,
    },
    { status: 201 },
  );
}
