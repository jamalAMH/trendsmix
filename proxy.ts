import { updateSession } from "@/lib/supabase/middleware";
import {
  shouldBlockAfricanVisitor,
  shouldBypassSiteRestrictions,
} from "@/lib/geo";
import { NextResponse, type NextRequest } from "next/server";

interface PublicSiteSettings {
  maintenanceMode: boolean;
  geoBlockAfrica: boolean;
  geoAllowedIps: string;
}

async function getPublicSiteSettings(): Promise<PublicSiteSettings> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return {
      maintenanceMode: false,
      geoBlockAfrica: false,
      geoAllowedIps: "",
    };
  }

  try {
    const res = await fetch(
      `${url}/rest/v1/settings?key=in.(maintenance_mode,geo_block_africa,geo_allowed_ips)&select=key,value`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
      },
    );
    if (!res.ok) {
      return {
        maintenanceMode: false,
        geoBlockAfrica: false,
        geoAllowedIps: "",
      };
    }

    const data = (await res.json()) as Array<{ key: string; value: string }>;
    const map: Record<string, string> = {};
    for (const row of data) {
      map[row.key] = row.value;
    }

    return {
      maintenanceMode: map.maintenance_mode === "true",
      geoBlockAfrica: map.geo_block_africa !== "false",
      geoAllowedIps: map.geo_allowed_ips ?? "",
    };
  } catch {
    return {
      maintenanceMode: false,
      geoBlockAfrica: false,
      geoAllowedIps: "",
    };
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    return updateSession(request);
  }

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/maintenance" ||
    pathname === "/geo-blocked"
  ) {
    return NextResponse.next({ request });
  }

  // Search/ad crawlers always see the live site (SEO + AdSense).
  if (shouldBypassSiteRestrictions(request)) {
    return NextResponse.next({ request });
  }

  const settings = await getPublicSiteSettings();

  if (
    shouldBlockAfricanVisitor(
      request,
      settings.geoBlockAfrica,
      settings.geoAllowedIps,
    )
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/geo-blocked";
    return NextResponse.rewrite(url);
  }

  if (settings.maintenanceMode) {
    const url = request.nextUrl.clone();
    url.pathname = "/maintenance";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
