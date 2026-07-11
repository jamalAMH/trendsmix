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
  "google_site_verification",
]);

export async function updateSettings(formData: FormData) {
  const { supabase } = await requireAdmin();

  for (const key of ALLOWED_KEYS) {
    const value = (formData.get(key) as string) ?? "";
    const { data: existing } = await supabase
      .from("settings")
      .select("id")
      .eq("key", key)
      .maybeSingle();

    if (existing) {
      await supabase.from("settings").update({ value }).eq("key", key);
    } else {
      await supabase.from("settings").insert({ key, value });
    }
  }

  revalidatePath("/admin/settings");
  revalidatePath("/");
}
