import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { parseTrafficSource, getGeoFromHeaders } from "@/lib/analytics";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(request: Request) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  let body: { path?: string; referrer?: string; sessionId?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const path = body.path?.trim();
  const sessionId = body.sessionId?.trim();

  if (!sessionId || !path || !path.startsWith("/") || path.startsWith("/admin")) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const referrer = body.referrer?.trim() ?? "";
  const source = parseTrafficSource(referrer);
  const { country } = getGeoFromHeaders(request.headers);
  const now = new Date().toISOString();

  const { error } = await supabase.from("active_sessions").upsert(
    {
      session_id: sessionId,
      path,
      referrer,
      source,
      country,
      last_seen: now,
    },
    { onConflict: "session_id" },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Clean up stale sessions older than 10 minutes.
  const stale = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  await supabase.from("active_sessions").delete().lt("last_seen", stale);

  return NextResponse.json({ ok: true });
}
