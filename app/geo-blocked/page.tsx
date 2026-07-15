import type { Metadata } from "next";
import GeoBlockedScreen from "@/components/layout/GeoBlockedScreen";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Not Available",
  description: "TrendsMix is not available in your region.",
  path: "/geo-blocked",
  noIndex: true,
});

export default function GeoBlockedPage() {
  return <GeoBlockedScreen />;
}
