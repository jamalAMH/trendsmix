import type { NextRequest } from "next/server";
import { getGeoFromHeaders } from "@/lib/analytics";

/** ISO 3166-1 alpha-2 codes for African countries (incl. Morocco). */
export const AFRICAN_COUNTRY_CODES = new Set([
  "DZ", "AO", "BJ", "BW", "BF", "BI", "CV", "CM", "CF", "TD", "KM", "CG", "CD",
  "CI", "DJ", "EG", "GQ", "ER", "SZ", "ET", "GA", "GM", "GH", "GN", "GW", "KE",
  "LS", "LR", "LY", "MG", "MW", "ML", "MR", "MU", "MA", "MZ", "NA", "NE", "NG",
  "RW", "ST", "SN", "SC", "SL", "SO", "ZA", "SS", "SD", "TZ", "TG", "TN", "UG",
  "ZM", "ZW", "EH",
]);

export function isAfricanCountry(code: string): boolean {
  if (!code || code === "XX" || code === "Unknown") return false;
  return AFRICAN_COUNTRY_CODES.has(code.toUpperCase());
}

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() ?? "";
}

export function getClientIpFromHeaders(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip")?.trim() ?? "";
}

function parseAllowedIps(raw: string): Set<string> {
  const ips = new Set<string>();
  for (const part of raw.split(",")) {
    const ip = part.trim();
    if (ip) ips.add(ip);
  }
  return ips;
}

export function getAllowedIpsFromEnv(): Set<string> {
  return parseAllowedIps(process.env.GEO_ALLOWED_IPS ?? "");
}

export function isIpAllowed(
  request: NextRequest,
  extraAllowedIps = "",
): boolean {
  const allowed = getAllowedIpsFromEnv();
  for (const ip of parseAllowedIps(extraAllowedIps)) {
    allowed.add(ip);
  }
  if (allowed.size === 0) return false;

  const clientIp = getClientIp(request);
  return clientIp !== "" && allowed.has(clientIp);
}

export function shouldBlockAfricanVisitor(
  request: NextRequest,
  geoBlockAfrica: boolean,
  extraAllowedIps = "",
): boolean {
  if (!geoBlockAfrica) return false;

  const { country } = getGeoFromHeaders(request.headers);
  if (!isAfricanCountry(country)) return false;

  return !isIpAllowed(request, extraAllowedIps);
}
