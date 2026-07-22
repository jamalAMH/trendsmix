import { Suspense } from "react";
import { getSetting } from "@/lib/settings";
import { isValidGa4Id } from "@/lib/google-analytics";
import GoogleAnalyticsInner from "@/components/analytics/GoogleAnalyticsInner";

export default async function GoogleAnalyticsScript() {
  const measurementId = (await getSetting("analytics_id")).trim();
  if (!measurementId || !isValidGa4Id(measurementId)) return null;

  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsInner measurementId={measurementId} />
    </Suspense>
  );
}
