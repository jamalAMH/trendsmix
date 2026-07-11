"use client";

import { useEffect } from "react";

interface AdSenseUnitProps {
  clientId: string;
  slotId: string;
}

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export default function AdSenseUnit({ clientId, slotId }: AdSenseUnitProps) {
  useEffect(() => {
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // AdSense may be blocked by the browser.
    }
  }, []);

  if (!clientId || !slotId) return null;

  return (
    <div className="my-8 flex justify-center">
      <ins
        className="adsbygoogle block w-full max-w-3xl overflow-hidden rounded-lg bg-zinc-900/40"
        style={{ display: "block", minHeight: 90 }}
        data-ad-client={clientId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
