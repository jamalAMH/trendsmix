import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const MAX_BYTES = 10 * 1024 * 1024;
const FETCH_MS = 20_000;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
]);

function extensionForType(contentType: string): string {
  const base = contentType.split(";")[0].trim().toLowerCase();
  switch (base) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/gif":
      return "gif";
    case "image/webp":
      return "webp";
    case "image/avif":
      return "avif";
    default:
      return "jpg";
  }
}

function isAlreadyHosted(url: string, supabaseUrl: string): boolean {
  try {
    const host = new URL(url).hostname;
    return host.includes("supabase.co") || url.startsWith(supabaseUrl);
  } catch {
    return false;
  }
}

async function isAuthorized(
  req: Request,
  service: ReturnType<typeof createClient>,
): Promise<boolean> {
  const apiKey = req.headers.get("x-api-key");
  if (apiKey) {
    const { data } = await service
      .from("settings")
      .select("value")
      .eq("key", "n8n_api_key")
      .maybeSingle();
    if (data?.value && apiKey === data.value) return true;
  }

  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) {
    const token = auth.slice(7);
    const {
      data: { user },
    } = await service.auth.getUser(token);
    if (user) {
      const { data: profile } = await service
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();
      if (profile?.role === "admin") return true;
    }
  }

  return false;
}

async function mirrorImageToStorage(
  service: ReturnType<typeof createClient>,
  sourceUrl: string,
  supabaseOrigin: string,
): Promise<string | null> {
  const trimmed = sourceUrl.trim();
  if (!trimmed || isAlreadyHosted(trimmed, supabaseOrigin)) {
    return trimmed || null;
  }

  try {
    const res = await fetch(trimmed, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(FETCH_MS),
    });

    if (!res.ok) return null;

    const contentType = (res.headers.get("content-type") ?? "image/jpeg")
      .split(";")[0]
      .trim()
      .toLowerCase();

    if (!ALLOWED_TYPES.has(contentType)) return null;

    const buffer = new Uint8Array(await res.arrayBuffer());
    if (buffer.length === 0 || buffer.length > MAX_BYTES) return null;

    const ext = extensionForType(contentType);
    const path = `imports/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { data, error } = await service.storage
      .from("media")
      .upload(path, buffer, { contentType, upsert: false });

    if (error) return null;

    const {
      data: { publicUrl },
    } = service.storage.from("media").getPublicUrl(data.path);

    return publicUrl;
  } catch {
    return null;
  }
}

async function mirrorImagesInHtml(
  service: ReturnType<typeof createClient>,
  html: string,
  supabaseOrigin: string,
): Promise<string> {
  const imgRegex = /<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;
  const urls = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = imgRegex.exec(html)) !== null) {
    urls.add(match[1]);
  }

  if (urls.size === 0) return html;

  const replacements = new Map<string, string>();
  for (const url of urls) {
    const mirrored = await mirrorImageToStorage(service, url, supabaseOrigin);
    if (mirrored && mirrored !== url) {
      replacements.set(url, mirrored);
    }
  }

  if (replacements.size === 0) return html;

  let updated = html;
  for (const [from, to] of replacements) {
    updated = updated.split(from).join(to);
  }
  return updated;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "authorization, x-api-key, content-type",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!supabaseUrl || !serviceKey) {
    return new Response(JSON.stringify({ error: "Server misconfigured" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  const service = createClient(supabaseUrl, serviceKey);

  if (!(await isAuthorized(req, service))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: { action?: string; url?: string; html?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const origin = supabaseUrl.replace(/\/$/, "");

  if (body.action === "mirror") {
    const url = body.url?.trim();
    if (!url) {
      return new Response(JSON.stringify({ error: "url is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const mirrored = await mirrorImageToStorage(service, url, origin);
    if (!mirrored) {
      return new Response(JSON.stringify({ error: "Could not mirror image" }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ url: mirrored }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (body.action === "mirror-html") {
    const html = body.html ?? "";
    const mirrored = await mirrorImagesInHtml(service, html, origin);
    return new Response(JSON.stringify({ html: mirrored }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ error: "Unknown action" }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
});
