"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "./helpers";

const ALLOWED_KEYS = new Set([
  "site_name",
  "site_description",
  "logo_url",
  "favicon_url",
  "twitter_url",
  "instagram_url",
  "facebook_url",
  "adsense_client_id",
  "adsense_slot_id",
  "analytics_id",
]);

export async function updateSettings(formData: FormData) {
  const { supabase } = await requireAdmin();

  for (const key of ALLOWED_KEYS) {
    const value = (formData.get(key) as string) ?? "";
    await supabase.from("settings").update({ value }).eq("key", key);
  }

  revalidatePath("/admin/settings");
  revalidatePath("/");
}
