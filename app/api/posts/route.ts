import { NextResponse } from "next/server";
import { verifyApiKey } from "@/lib/api-auth";
import { hasExternalImages } from "@/lib/prepare-post-images";
import {
  isImageStorageConfigured,
  persistPostImages,
} from "@/lib/post-images";
import { revalidateStoryPaths } from "@/lib/revalidate-stories";
import { isN8nEnabled } from "@/lib/settings";
import { createClient } from "@supabase/supabase-js";

interface CreatePostBody {
  title: string;
  article_content: string;
  image?: string;
  "url image"?: string;
}

const NOISE_PATTERNS = [
  /\d+×Search for:.*?Menu/gi,
  /\bAd\b(?=\s*[A-Z])/g,
  /Advertisement/gi,
  /\| Theme:.*$/gm,
  /Search for:.*?(?=<|$)/gi,
  /\* \* \* \*/g,
  /Menu\s*#/gi,
  /Restaurants?\s*\*/gi,
];

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function cleanContent(html: string): string {
  let cleaned = html;
  for (const pattern of NOISE_PATTERNS) {
    cleaned = cleaned.replace(pattern, "");
  }
  return cleaned
    .replace(/(<br\s*\/?>\s*){3,}/gi, "<br><br>")
    .replace(/^\s+|\s+$/g, "");
}

function generateExcerpt(html: string, maxLen = 160): string {
  const text = stripHtml(html);
  if (text.length <= maxLen) return text;
  const cut = text.lastIndexOf(" ", maxLen);
  return text.slice(0, cut > 0 ? cut : maxLen) + "...";
}

function calculateReadTime(html: string): number {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
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

  const rawImage = body.image?.trim() || body["url image"]?.trim() || null;
  const content = cleanContent(body.article_content);

  if (hasExternalImages(rawImage, content) && !isImageStorageConfigured()) {
    return NextResponse.json(
      {
        error:
          "Image storage is not configured. Deploy the mirror-image Supabase function or add SUPABASE_SERVICE_ROLE_KEY.",
      },
      { status: 503 },
    );
  }

  let featuredImage = rawImage;
  let preparedContent = content;

  if (isImageStorageConfigured()) {
    try {
      const apiKeyHeader = request.headers.get("x-api-key");
      const authHeader = request.headers.get("authorization");
      const providedKey =
        apiKeyHeader ??
        (authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null);
      const mirrorAuth = providedKey
        ? ({ type: "api-key" as const, key: providedKey })
        : null;
      const prepared = await persistPostImages(
        rawImage,
        content,
        [],
        mirrorAuth,
      );
      featuredImage = prepared.featuredImage;
      preparedContent = prepared.content;
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Failed to save images to storage.",
        },
        { status: 502 },
      );
    }
  }

  const excerpt = generateExcerpt(preparedContent);
  const readTime = calculateReadTime(preparedContent);

  const supabase = getSupabase();
  const { data, error } = await supabase.rpc("publish_post_n8n", {
    p_api_key: apiKey,
    p_title: body.title.trim(),
    p_content: preparedContent,
    p_slug: null,
    p_excerpt: excerpt,
    p_category_slug: null,
    p_status: "published",
    p_featured: false,
    p_read_time: readTime,
    p_featured_image: featuredImage,
    p_featured_image_alt: "",
    p_meta_title: null,
    p_meta_description: null,
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
    { ok: true, post, url: `/stories/${post.slug}` },
    { status: 201 },
  );
}
