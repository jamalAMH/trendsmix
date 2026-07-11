import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { verifyApiKey } from "@/lib/api-auth";
import { createClient } from "@supabase/supabase-js";

interface CreatePostBody {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  category?: string;
  status?: "draft" | "published";
  featured?: boolean;
  read_time?: number;
  featured_image?: string;
  featured_image_alt?: string;
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
  og_image?: string;
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

  let body: CreatePostBody;
  try {
    body = (await request.json()) as CreatePostBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.title?.trim()) {
    return NextResponse.json({ error: "title is required." }, { status: 400 });
  }

  if (!body.content?.trim()) {
    return NextResponse.json({ error: "content is required." }, { status: 400 });
  }

  const apiKey = process.env.N8N_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "N8N_API_KEY is not configured on the server." },
      { status: 503 },
    );
  }

  const supabase = getSupabase();
  const { data, error } = await supabase.rpc("publish_post_n8n", {
    p_api_key: apiKey,
    p_title: body.title.trim(),
    p_content: body.content,
    p_slug: body.slug?.trim() || null,
    p_excerpt: body.excerpt?.trim() ?? "",
    p_category_slug: body.category?.trim() || null,
    p_status: body.status ?? "published",
    p_featured: body.featured ?? false,
    p_read_time: body.read_time ?? 5,
    p_featured_image: body.featured_image ?? null,
    p_featured_image_alt: body.featured_image_alt ?? "",
    p_meta_title: body.meta_title ?? null,
    p_meta_description: body.meta_description ?? null,
    p_canonical_url: body.canonical_url ?? null,
    p_og_image: body.og_image ?? null,
  });

  if (error) {
    const message = error.message;
    if (message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (message.includes("already exists")) {
      return NextResponse.json({ error: message }, { status: 409 });
    }
    if (message.includes("Unknown category") || message.includes("required")) {
      return NextResponse.json({ error: message }, { status: 400 });
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

  revalidatePath("/");
  revalidatePath("/stories");
  revalidatePath(`/stories/${post.slug}`);
  revalidatePath("/sitemap.xml");
  revalidatePath("/feed.xml");

  return NextResponse.json(
    {
      ok: true,
      post,
      url: `/stories/${post.slug}`,
    },
    { status: 201 },
  );
}
