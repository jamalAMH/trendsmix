import Script from "next/script";

interface AdSenseScriptProps {
  clientId: string;
}

export default function AdSenseScript({ clientId }: AdSenseScriptProps) {
  if (!clientId) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
