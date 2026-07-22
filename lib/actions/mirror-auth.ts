"use server";

import type { MirrorAuth } from "@/lib/image-mirror-edge";
import { createClient } from "@/lib/supabase/server";

export async function getAdminMirrorAuth(): Promise<MirrorAuth | null> {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) return null;
  return { type: "bearer", token: session.access_token };
}
