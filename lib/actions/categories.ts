"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "./helpers";

export async function createCategory(formData: FormData) {
  const { supabase } = await requireAdmin();

  const name = (formData.get("name") as string).trim();
  const slug = (formData.get("slug") as string).trim();
  const description = (formData.get("description") as string) ?? "";

  if (!name || !slug) throw new Error("Name and slug are required");

  const { error } = await supabase
    .from("categories")
    .insert({ name, slug, description });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/categories");
}

export async function updateCategory(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const name = (formData.get("name") as string).trim();
  const slug = (formData.get("slug") as string).trim();
  const description = (formData.get("description") as string) ?? "";

  if (!name || !slug) throw new Error("Name and slug are required");

  const { error } = await supabase
    .from("categories")
    .update({ name, slug, description })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/categories");
}

export async function deleteCategory(id: string) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/categories");
}
