import { createClient } from "@/lib/supabase/server";

export async function getSetting(key: string): Promise<string> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();

  return data?.value ?? "";
}

export async function isMaintenanceMode(): Promise<boolean> {
  return (await getSetting("maintenance_mode")) === "true";
}

export async function isN8nEnabled(): Promise<boolean> {
  const value = await getSetting("n8n_enabled");
  return value !== "false";
}

export interface MonetizationSettings {
  adsenseClientId: string;
  adsenseSlotId: string;
  analyticsId: string;
  googleSiteVerification: string;
}

export async function getMonetizationSettings(): Promise<MonetizationSettings> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("settings")
    .select("key, value")
    .in("key", [
      "adsense_client_id",
      "adsense_slot_id",
      "analytics_id",
      "google_site_verification",
    ]);

  const map: Record<string, string> = {};
  data?.forEach((row) => {
    map[row.key] = row.value;
  });

  return {
    adsenseClientId: map.adsense_client_id ?? "",
    adsenseSlotId: map.adsense_slot_id ?? "",
    analyticsId: map.analytics_id ?? "",
    googleSiteVerification: map.google_site_verification ?? "",
  };
}
