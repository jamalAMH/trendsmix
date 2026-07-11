import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type AdminClient = SupabaseClient<any, "public", any>;

let _adminClient: AdminClient | null = null;

export function createAdminClient(): AdminClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  if (!_adminClient) {
    _adminClient = createClient(url, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }

  return _adminClient;
}
