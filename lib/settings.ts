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
