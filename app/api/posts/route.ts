import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { verifyApiKey } from "@/lib/api-auth";
import { createClient } from "@supabase/supabase-js";

interface CreatePostBody {
  title: string;
  article_content: string;
  image?: string;
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

  const supabase = getSupabase();
  const { data, error } = await supabase.rpc("publish_post_n8n", {
    p_api_key: apiKey,
    p_title: body.title.trim(),
    p_content: body.article_content,
    p_slug: null,
    p_excerpt: "",
    p_category_slug: null,
    p_status: "published",
    p_featured: false,
    p_read_time: 5,
    p_featured_image: body.image?.trim() || null,
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

  revalidatePath("/");
  revalidatePath("/stories");
  revalidatePath(`/stories/${post.slug}`);
  revalidatePath("/sitemap.xml");
  revalidatePath("/feed.xml");

  return NextResponse.json(
    { ok: true, post, url: `/stories/${post.slug}` },
    { status: 201 },
  );
}
