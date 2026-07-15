import { createClient } from "@/lib/supabase/server";
import ControlCenter from "@/components/admin/ControlCenter";
import { getGeoFromHeaders, formatCountryName } from "@/lib/analytics";
import { getClientIpFromHeaders } from "@/lib/geo";
import { headers } from "next/headers";

export default async function ControlPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()
    : { data: null };

  const h = await headers();
  const { country } = getGeoFromHeaders(h);

  const systemStatus = {
    supabaseConfigured: !!(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ),
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "",
    n8nEnvConfigured: !!process.env.N8N_API_KEY,
    visitorIp: getClientIpFromHeaders(h),
    visitorCountry: formatCountryName(country),
  };

  return (
    <ControlCenter
      systemStatus={systemStatus}
      isAdmin={profile?.role === "admin"}
    />
  );
}
