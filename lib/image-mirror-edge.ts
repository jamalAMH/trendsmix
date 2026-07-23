export type MirrorAuth =
  | { type: "api-key"; key: string }
  | { type: "bearer"; token: string };

function mirrorFunctionUrl(): string | null {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) return null;
  return `${base}/functions/v1/mirror-image`;
}

/** Gateway + custom auth headers for the mirror-image Edge Function. */
function edgeRequestHeaders(auth: MirrorAuth): Record<string, string> {
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Supabase Functions gateway expects the project anon key
  if (anon) {
    headers.apikey = anon;
    if (auth.type === "bearer") {
      headers.Authorization = `Bearer ${auth.token}`;
    } else {
      headers.Authorization = `Bearer ${anon}`;
    }
  } else if (auth.type === "bearer") {
    headers.Authorization = `Bearer ${auth.token}`;
  }

  if (auth.type === "api-key") {
    headers["x-api-key"] = auth.key;
  }

  return headers;
}

export function isEdgeMirrorAvailable(): boolean {
  return !!mirrorFunctionUrl();
}

export function defaultMirrorAuth(): MirrorAuth | null {
  const key = process.env.N8N_API_KEY?.trim();
  if (key) return { type: "api-key", key };
  return null;
}

export async function mirrorUrlViaEdge(
  sourceUrl: string,
  auth: MirrorAuth,
): Promise<string | null> {
  const url = mirrorFunctionUrl();
  if (!url) return null;

  const res = await fetch(url, {
    method: "POST",
    headers: edgeRequestHeaders(auth),
    body: JSON.stringify({
      action: "mirror",
      url: sourceUrl,
      ...(auth.type === "api-key" ? { api_key: auth.key } : {}),
    }),
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
    headers: edgeRequestHeaders(auth),
    body: JSON.stringify({
      action: "mirror-html",
      html,
      ...(auth.type === "api-key" ? { api_key: auth.key } : {}),
    }),
  });

  if (!res.ok) return html;

  const data = (await res.json()) as { html?: string };
  return data.html ?? html;
}
