export type MirrorAuth =
  | { type: "api-key"; key: string }
  | { type: "bearer"; token: string };

function mirrorFunctionUrl(): string | null {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) return null;
  return `${base}/functions/v1/mirror-image`;
}

function authHeaders(auth: MirrorAuth): Record<string, string> {
  if (auth.type === "api-key") {
    return { "x-api-key": auth.key };
  }
  return { Authorization: `Bearer ${auth.token}` };
}

export function isEdgeMirrorAvailable(): boolean {
  return !!mirrorFunctionUrl();
}

export async function mirrorUrlViaEdge(
  sourceUrl: string,
  auth: MirrorAuth,
): Promise<string | null> {
  const url = mirrorFunctionUrl();
  if (!url) return null;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(auth),
    },
    body: JSON.stringify({ action: "mirror", url: sourceUrl }),
  });

  if (!res.ok) return null;

  const data = (await res.json()) as { url?: string | null };
  return data.url ?? null;
}

export async function mirrorHtmlViaEdge(
  html: string,
  auth: MirrorAuth,
): Promise<string> {
  const url = mirrorFunctionUrl();
  if (!url) return html;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(auth),
    },
    body: JSON.stringify({ action: "mirror-html", html }),
  });

  if (!res.ok) return html;

  const data = (await res.json()) as { html?: string };
  return data.html ?? html;
}

export function defaultMirrorAuth(): MirrorAuth | null {
  const key = process.env.N8N_API_KEY;
  if (key) return { type: "api-key", key };
  return null;
}
