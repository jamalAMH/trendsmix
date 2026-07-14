"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const HEARTBEAT_MS = 30_000;

function getSessionId(): string {
  const key = "tmx_session";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

function sendTrack(path: string, referrer: string, sessionId: string) {
  fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, referrer, sessionId }),
    keepalive: true,
  }).catch(() => {});
}

function sendHeartbeat(path: string, referrer: string, sessionId: string) {
  fetch("/api/analytics/heartbeat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, referrer, sessionId }),
    keepalive: true,
  }).catch(() => {});
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;

    const referrer = document.referrer;
    const sessionId = getSessionId();

    if (lastTracked.current !== pathname) {
      lastTracked.current = pathname;
      sendTrack(pathname, referrer, sessionId);
    }

    sendHeartbeat(pathname, referrer, sessionId);

    const interval = setInterval(() => {
      sendHeartbeat(pathname, document.referrer, sessionId);
    }, HEARTBEAT_MS);

    return () => clearInterval(interval);
  }, [pathname]);

  return null;
}
