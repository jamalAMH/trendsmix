import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

interface AdminContext {
  supabase: SupabaseClient;
  userId: string;
}

/**
 * Verifies the caller is an authenticated user with the "admin" role.
 * Returns the Supabase client and userId for downstream queries.
 * Throws if unauthenticated or not an admin.
 */
export async function requireAdmin(): Promise<AdminContext> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized — you must be signed in.");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Forbidden — admin role required.");
  }

  return { supabase, userId: user.id };
}
