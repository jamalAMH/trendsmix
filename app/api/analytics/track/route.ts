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
  if (!path || !path.startsWith("/") || path.startsWith("/admin")) {
    return NextResponse.json({ error: "Invalid path." }, { status: 400 });
  }

  const referrer = body.referrer?.trim() ?? "";
  const sessionId = body.sessionId?.trim() ?? "";
  const source = parseTrafficSource(referrer);
  const userAgent = request.headers.get("user-agent") ?? "";
  const { country, city } = getGeoFromHeaders(request.headers);

  const { error } = await supabase.from("page_views").insert({
    path,
    referrer,
    source,
    country,
    city: city || null,
    session_id: sessionId || null,
    user_agent: userAgent.slice(0, 500),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
