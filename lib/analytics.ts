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
