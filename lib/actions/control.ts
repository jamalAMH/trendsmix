"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "./helpers";

const CONTROL_KEYS = new Set([
  "maintenance_mode",
  "n8n_enabled",
  "n8n_api_key",
]);

async function upsertSetting(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  key: string,
  value: string,
) {
  const { data: existing } = await supabase
    .from("settings")
    .select("id")
    .eq("key", key)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("settings")
      .update({ value })
      .eq("key", key);
    if (error) throw new Error(error.message);
    return;
  }

  const { error } = await supabase.from("settings").insert({ key, value });
  if (error) throw new Error(error.message);
}

export async function updateControlSettings(formData: FormData) {
  const { supabase } = await requireAdmin();

  for (const key of CONTROL_KEYS) {
    if (key === "maintenance_mode" || key === "n8n_enabled") {
      const value = formData.get(key) === "true" ? "true" : "false";
      await upsertSetting(supabase, key, value);
      continue;
    }

    const value = ((formData.get(key) as string) ?? "").trim();
    await upsertSetting(supabase, key, value);
  }

  revalidatePath("/admin/control");
  revalidatePath("/");
}

export async function bulkPublishDrafts() {
  const { supabase } = await requireAdmin();
  const now = new Date().toISOString();

  const { error } = await supabase
    .from("posts")
    .update({ status: "published", published_at: now })
    .eq("status", "draft");

  if (error) throw new Error(error.message);

  revalidatePath("/admin/control");
  revalidatePath("/admin/posts");
  revalidatePath("/");
  revalidatePath("/stories");
}

export async function bulkUnpublishAll() {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("posts")
    .update({ status: "draft", published_at: null })
    .eq("status", "published");

  if (error) throw new Error(error.message);

  revalidatePath("/admin/control");
  revalidatePath("/admin/posts");
  revalidatePath("/");
  revalidatePath("/stories");
}

export async function bulkClearFeatured() {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("posts")
    .update({ featured: false })
    .eq("featured", true);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/control");
  revalidatePath("/admin/posts");
  revalidatePath("/");
}

export async function bulkDeleteDrafts() {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("status", "draft");

  if (error) throw new Error(error.message);

  revalidatePath("/admin/control");
  revalidatePath("/admin/posts");
  revalidatePath("/");
  revalidatePath("/stories");
}

export async function revalidateSite() {
  await requireAdmin();

  revalidatePath("/", "layout");
  revalidatePath("/stories");
  revalidatePath("/sitemap.xml");
  revalidatePath("/feed.xml");
  revalidatePath("/admin/control");
}
