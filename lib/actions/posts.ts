"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "./helpers";

export async function createPost(formData: FormData) {
  const { supabase, userId } = await requireAdmin();

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const categoryId = formData.get("category_id") as string;
  const status = formData.get("status") as string;
  const featured = formData.get("featured") === "true";
  const readTime = parseInt(formData.get("read_time") as string, 10) || 5;
  const featuredImage = formData.get("featured_image") as string;
  const featuredImageAlt = formData.get("featured_image_alt") as string;
  const metaTitle = formData.get("meta_title") as string;
  const metaDescription = formData.get("meta_description") as string;
  const canonicalUrl = formData.get("canonical_url") as string;
  const ogImage = formData.get("og_image") as string;

  const { data, error } = await supabase
    .from("posts")
    .insert({
      title,
      slug,
      excerpt,
      content,
      category_id: categoryId || null,
      author_id: userId,
      status,
      featured,
      read_time: readTime,
      featured_image: featuredImage || null,
      featured_image_alt: featuredImageAlt,
      meta_title: metaTitle || null,
      meta_description: metaDescription || null,
      canonical_url: canonicalUrl || null,
      og_image: ogImage || null,
      published_at: status === "published" ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/admin/posts");
  revalidatePath("/");
  revalidatePath("/stories");
  redirect(`/admin/posts/${data.id}/edit`);
}

export async function updatePost(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const categoryId = formData.get("category_id") as string;
  const status = formData.get("status") as string;
  const featured = formData.get("featured") === "true";
  const readTime = parseInt(formData.get("read_time") as string, 10) || 5;
  const featuredImage = formData.get("featured_image") as string;
  const featuredImageAlt = formData.get("featured_image_alt") as string;
  const metaTitle = formData.get("meta_title") as string;
  const metaDescription = formData.get("meta_description") as string;
  const canonicalUrl = formData.get("canonical_url") as string;
  const ogImage = formData.get("og_image") as string;

  const { data: existing } = await supabase
    .from("posts")
    .select("published_at, status")
    .eq("id", id)
    .single();

  let publishedAt = existing?.published_at ?? null;
  if (status === "published" && existing?.status !== "published") {
    publishedAt = new Date().toISOString();
  }

  const { error } = await supabase
    .from("posts")
    .update({
      title,
      slug,
      excerpt,
      content,
      category_id: categoryId || null,
      status,
      featured,
      read_time: readTime,
      featured_image: featuredImage || null,
      featured_image_alt: featuredImageAlt,
      meta_title: metaTitle || null,
      meta_description: metaDescription || null,
      canonical_url: canonicalUrl || null,
      og_image: ogImage || null,
      published_at: publishedAt,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/posts");
  revalidatePath("/");
  revalidatePath("/stories");
  revalidatePath(`/stories/${slug}`);
}

export async function deletePost(id: string) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/posts");
  revalidatePath("/");
  revalidatePath("/stories");
}

export async function togglePostStatus(id: string) {
  const { supabase } = await requireAdmin();

  const { data: post } = await supabase
    .from("posts")
    .select("status, slug")
    .eq("id", id)
    .single();

  if (!post) throw new Error("Post not found");

  const newStatus = post.status === "published" ? "draft" : "published";
  const publishedAt =
    newStatus === "published" ? new Date().toISOString() : null;

  const { error } = await supabase
    .from("posts")
    .update({ status: newStatus, published_at: publishedAt })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/posts");
  revalidatePath("/");
  revalidatePath("/stories");
  revalidatePath(`/stories/${post.slug}`);
}

export async function togglePostFeatured(id: string) {
  const { supabase } = await requireAdmin();

  const { data: post } = await supabase
    .from("posts")
    .select("featured")
    .eq("id", id)
    .single();

  if (!post) throw new Error("Post not found");

  const { error } = await supabase
    .from("posts")
    .update({ featured: !post.featured })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/posts");
}
