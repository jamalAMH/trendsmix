import { getSetting } from "@/lib/settings";
import { parseHeadSnippet } from "@/lib/html-snippet";

/**
 * Code pasted in Admin → Settings → "Code & Plugins" for the <head>
 * (ad networks, verification meta tags, pixels…). Rendered inside <head>.
 */
export async function CustomHeadCode() {
  const code = (await getSetting("custom_head_code")).trim();
  if (!code) return null;

  return (
    <>
      {parseHeadSnippet(code).map(({ tag, props, inner }, i) => {
        const key = `custom-head-${i}`;
        if (tag === "meta") return <meta key={key} {...props} />;
        if (tag === "link") return <link key={key} {...props} />;
        if (tag === "script") {
          return inner.trim() ? (
            <script key={key} {...props} dangerouslySetInnerHTML={{ __html: inner }} />
          ) : (
            <script key={key} {...props} />
          );
        }
        if (tag === "style") {
          return <style key={key} {...props} dangerouslySetInnerHTML={{ __html: inner }} />;
        }
        return <noscript key={key} dangerouslySetInnerHTML={{ __html: inner }} />;
      })}
    </>
  );
}

/**
 * Code pasted for the end of <body> (ad tags, chat widgets, pixels…). Server-rendered
 * as-is, so its scripts run when the page loads.
 */
export async function CustomBodyCode() {
  const code = (await getSetting("custom_body_code")).trim();
  if (!code) return null;

  return (
    <div
      id="custom-body-code"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: code }}
    />
  );
}
