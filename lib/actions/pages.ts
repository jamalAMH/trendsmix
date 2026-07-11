"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "./helpers";

export async function updatePage(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const title = (formData.get("title") as string).trim();
  const content = formData.get("content") as string;
  const metaTitle = formData.get("meta_title") as string;
  const metaDescription = formData.get("meta_description") as string;

  if (!title) throw new Error("Title is required");

  const { data: page } = await supabase
    .from("pages")
    .select("slug")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("pages")
    .update({
      title,
      content,
      meta_title: metaTitle || null,
      meta_description: metaDescription || null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/pages");
  if (page?.slug) {
    revalidatePath(`/${page.slug}`);
  }
}
