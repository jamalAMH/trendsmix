import { getSetting } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const clientId = await getSetting("adsense_client_id");

  if (!clientId) {
    return new Response("", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  const publisherId = clientId.replace(/^ca-/, "");
  const body = `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`;

  return new Response(body, {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}
