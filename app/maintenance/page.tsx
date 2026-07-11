import type { Metadata } from "next";
import MaintenanceScreen from "@/components/layout/MaintenanceScreen";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Maintenance",
  description: "TrendsMix is temporarily unavailable for scheduled maintenance.",
  path: "/maintenance",
  noIndex: true,
});

export default function MaintenancePage() {
  return <MaintenanceScreen />;
}
