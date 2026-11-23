import { getSetting } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const [clientId, extra] = await Promise.all([
    getSetting("adsense_client_id"),
    getSetting("ads_txt_extra"),
  ]);

  const lines: string[] = [];
  if (clientId) {
    const publisherId = clientId.replace(/^ca-/, "");
    lines.push(`google.com, ${publisherId}, DIRECT, f08c47fec0942fa0`);
  }
  // Extra lines from Admin → Settings → Code & Plugins (other ad networks).
  for (const line of extra.split(/\r?\n/)) {
    if (line.trim()) lines.push(line.trim());
  }
  const body = lines.length ? `${lines.join("\n")}\n` : "";

  return new Response(body, {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}
