export function parseTrafficSource(referrer: string): string {
  if (!referrer || referrer.trim() === "") return "Direct";

  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "").toLowerCase();

    if (host.includes("google.")) return "Google";
    if (host.includes("facebook.") || host === "fb.com") return "Facebook";
    if (host.includes("instagram.")) return "Instagram";
    if (host === "t.co" || host.includes("twitter.") || host === "x.com")
      return "Twitter / X";
    if (host.includes("bing.")) return "Bing";
    if (host.includes("yahoo.")) return "Yahoo";
    if (host.includes("tiktok.")) return "TikTok";
    if (host.includes("reddit.")) return "Reddit";
    if (host.includes("pinterest.")) return "Pinterest";
    if (host.includes("trendsmix.")) return "Internal";

    return host;
  } catch {
    return "Unknown";
  }
}

export function formatPathLabel(path: string): string {
  if (path === "/") return "Homepage";
  if (path === "/stories") return "All Stories";
  if (path.startsWith("/stories/")) return path.replace("/stories/", "Story: ");
  return path;
}

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

export function formatCountryName(code: string): string {
  if (!code || code === "XX" || code === "Unknown") return "Unknown";
  try {
    return regionNames.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

export function getGeoFromHeaders(headers: Headers): {
  country: string;
  city: string;
} {
  const country =
    headers.get("x-vercel-ip-country") ??
    headers.get("cf-ipcountry") ??
    "Unknown";

  const city = headers.get("x-vercel-ip-city") ?? "";

  return { country, city };
}

export type PeriodPreset =
  | "today"
  | "yesterday"
  | "7d"
  | "15d"
  | "30d"
  | "custom";

export interface AnalyticsRecord {
  date: string;
  path: string;
  source: string;
  country: string;
  sessionId: string | null;
}

export interface PeriodTraffic {
  start: string;
  end: string;
  label: string;
  views: number;
  visitors: number;
  sources: Array<{ source: string; views: number }>;
  countries: Array<{ country: string; label: string; views: number }>;
  pages: Array<{ path: string; label: string; views: number }>;
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function daysAgoIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

function aggregateCounts<T extends string>(
  items: T[],
): Array<{ key: T; count: number }> {
  const map = new Map<T, number>();
  for (const item of items) {
    map.set(item, (map.get(item) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);
}

export function getDateRange(
  preset: PeriodPreset,
  customStart: string,
  customEnd: string,
): { start: string; end: string } {
  const today = todayIso();

  switch (preset) {
    case "today":
      return { start: today, end: today };
    case "yesterday": {
      const y = daysAgoIso(1);
      return { start: y, end: y };
    }
    case "7d":
      return { start: daysAgoIso(6), end: today };
    case "15d":
      return { start: daysAgoIso(14), end: today };
    case "30d":
      return { start: daysAgoIso(29), end: today };
    case "custom": {
      const start = customStart <= customEnd ? customStart : customEnd;
      const end = customStart <= customEnd ? customEnd : customStart;
      return { start, end };
    }
  }
}

export function formatPeriodLabel(start: string, end: string): string {
  if (start === end) {
    const d = new Date(start + "T12:00:00");
    const today = todayIso();
    const yesterday = daysAgoIso(1);
    if (start === today) return "Today";
    if (start === yesterday) return "Yesterday";
    return d.toLocaleDateString(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }

  const startD = new Date(start + "T12:00:00").toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  const endD = new Date(end + "T12:00:00").toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  return `${startD} – ${endD}`;
}

export function aggregatePeriod(
  records: AnalyticsRecord[],
  start: string,
  end: string,
): PeriodTraffic {
  const filtered = records.filter((r) => r.date >= start && r.date <= end);
  const sources = aggregateCounts(filtered.map((r) => r.source))
    .slice(0, 8)
    .map((s) => ({ source: s.key, views: s.count }));
  const countries = aggregateCounts(
    filtered.map((r) => r.country || "Unknown"),
  )
    .slice(0, 8)
    .map((c) => ({
      country: c.key,
      label: formatCountryName(c.key),
      views: c.count,
    }));
  const pages = aggregateCounts(filtered.map((r) => r.path))
    .slice(0, 8)
    .map((p) => ({
      path: p.key,
      label: formatPathLabel(p.key),
      views: p.count,
    }));
  const sessionIds = new Set(
    filtered.map((r) => r.sessionId).filter((id): id is string => !!id),
  );

  return {
    start,
    end,
    label: formatPeriodLabel(start, end),
    views: filtered.length,
    visitors: sessionIds.size,
    sources,
    countries,
    pages,
  };
}
