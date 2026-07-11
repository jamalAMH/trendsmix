import { getMonetizationSettings } from "@/lib/settings";
import AdSenseScript from "@/components/ads/AdSenseScript";
import GoogleAnalytics from "@/components/ads/GoogleAnalytics";

export default async function SiteScripts() {
  const settings = await getMonetizationSettings();

  return (
    <>
      <GoogleAnalytics measurementId={settings.analyticsId} />
      <AdSenseScript clientId={settings.adsenseClientId} />
    </>
  );
}
