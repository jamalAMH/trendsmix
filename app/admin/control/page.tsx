import ControlCenter from "@/components/admin/ControlCenter";

export default function ControlPage() {
  const systemStatus = {
    supabaseConfigured: !!(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ),
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "",
    n8nEnvConfigured: !!process.env.N8N_API_KEY,
  };

  return <ControlCenter systemStatus={systemStatus} />;
}
