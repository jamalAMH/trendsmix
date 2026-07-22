import { getSetting } from "@/lib/settings";

export default async function AdSenseScript() {
  const clientId = await getSetting("adsense_client_id");
  if (!clientId) return null;

  const normalizedClientId = clientId.startsWith("ca-")
    ? clientId
    : `ca-${clientId}`;

  return (
    <>
      <meta name="google-adsense-account" content={normalizedClientId} />
      <script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${normalizedClientId}`}
        crossOrigin="anonymous"
      />
    </>
  );
}
