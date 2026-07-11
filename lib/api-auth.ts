import { NextResponse } from "next/server";

export function verifyApiKey(request: Request): NextResponse | null {
  const expected = process.env.N8N_API_KEY;

  if (!expected) {
    return NextResponse.json(
      { error: "N8N_API_KEY is not configured on the server." },
      { status: 503 },
    );
  }

  const authHeader = request.headers.get("authorization");
  const apiKeyHeader = request.headers.get("x-api-key");

  const provided =
    apiKeyHeader ??
    (authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null);

  if (!provided || provided !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
