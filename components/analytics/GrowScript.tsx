import Script from "next/script";
import { getSetting } from "@/lib/settings";

export default async function GrowScript() {
  const siteId = (await getSetting("grow_id")).trim();
  if (!siteId) return null;

  return (
    <Script
      id="grow-me"
      strategy="afterInteractive"
      data-grow-initializer=""
    >
      {`!(function(){window.growMe||((window.growMe=function(e){window.growMe._.push(e);}),(window.growMe._=[]));var e=document.createElement("script");e.type="text/javascript",e.src="https://faves.grow.me/main.js",e.defer=!0,e.setAttribute("data-grow-faves-site-id","${siteId}");var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)})();`}
    </Script>
  );
}
