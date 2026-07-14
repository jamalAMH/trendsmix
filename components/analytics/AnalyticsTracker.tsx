"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

function getSessionId(): string {
  const key = "tmx_session";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    if (lastTracked.current === pathname) return;
    lastTracked.current = pathname;

    const referrer = document.referrer;
    const sessionId = getSessionId();

    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, referrer, sessionId }),
      keepalive: true,
    }).catch(() => {
      // Tracking should never break the page.
    });
  }, [pathname]);

  return null;
}
