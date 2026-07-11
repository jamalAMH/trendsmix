import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { verifyApiKey } from "@/lib/api-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";

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

async function resolveCategoryId(categorySlug?: string): Promise<string | null> {
  if (!categorySlug) return null;

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .single<{ id: string }>();

  return data?.id ?? null;
}

async function resolveAuthorId(): Promise<string | null> {
  const configured = process.env.N8N_AUTHOR_ID;
  if (configured) return configured;

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "admin")
    .limit(1)
    .single<{ id: string }>();

  return data?.id ?? null;
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

  const slug = body.slug?.trim() || slugify(body.title);
  const status = body.status ?? "published";

  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("posts")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: `A post with slug "${slug}" already exists.` },
      { status: 409 },
    );
  }

  const categoryId = await resolveCategoryId(body.category);
  if (body.category && !categoryId) {
    return NextResponse.json(
      {
        error: `Unknown category "${body.category}". Use: horror, mystery, romance, fantasy, sci-fi, drama.`,
      },
      { status: 400 },
    );
  }

  const authorId = await resolveAuthorId();

  const { data, error } = await supabase
    .from("posts")
    .insert({
      title: body.title.trim(),
      slug,
      excerpt: body.excerpt?.trim() ?? "",
      content: body.content,
      category_id: categoryId,
      author_id: authorId,
      status,
      featured: body.featured ?? false,
      read_time: body.read_time ?? 5,
      featured_image: body.featured_image ?? null,
      featured_image_alt: body.featured_image_alt ?? "",
      meta_title: body.meta_title ?? null,
      meta_description: body.meta_description ?? null,
      canonical_url: body.canonical_url ?? null,
      og_image: body.og_image ?? null,
      published_at: status === "published" ? new Date().toISOString() : null,
    })
    .select("id, slug, title, status, published_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/stories");
  revalidatePath(`/stories/${slug}`);
  revalidatePath("/sitemap.xml");
  revalidatePath("/feed.xml");

  return NextResponse.json(
    {
      ok: true,
      post: data,
      url: `/stories/${slug}`,
    },
    { status: 201 },
  );
}
