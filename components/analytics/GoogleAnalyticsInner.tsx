"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function pagePath(
  pathname: string,
  searchParams: URLSearchParams | null,
): string {
  const query = searchParams?.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export default function GoogleAnalyticsInner({
  measurementId,
}: {
  measurementId: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstView = useRef(true);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;

    if (isFirstView.current) {
      isFirstView.current = false;
      return;
    }

    const url = pagePath(pathname, searchParams);
    window.gtag?.("config", measurementId, { page_path: url });
  }, [pathname, searchParams, measurementId]);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}
