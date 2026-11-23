/**
 * Minimal parser for admin-pasted <head> snippets (ad networks, verification tags,
 * analytics). Turns <meta>, <link>, <script>, <style> and <noscript> tags into plain
 * objects that React can render inside <head>. Anything else is ignored.
 */
export interface SnippetTag {
  tag: "meta" | "link" | "script" | "style" | "noscript";
  props: Record<string, string | boolean>;
  inner: string;
}

const ATTR_NAME_MAP: Record<string, string> = {
  class: "className",
  crossorigin: "crossOrigin",
  charset: "charSet",
  "http-equiv": "httpEquiv",
  referrerpolicy: "referrerPolicy",
  nomodule: "noModule",
  fetchpriority: "fetchPriority",
};

const BOOLEAN_ATTRS = new Set(["async", "defer", "nomodule"]);

function parseAttrs(raw: string): Record<string, string | boolean> {
  const props: Record<string, string | boolean> = {};
  const re = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw))) {
    const name = m[1].toLowerCase();
    if (name.startsWith("on")) continue; // no inline event handlers
    const value = m[2] ?? m[3] ?? m[4];
    const key = ATTR_NAME_MAP[name] ?? name;
    props[key] = value === undefined ? (BOOLEAN_ATTRS.has(name) ? true : "") : value;
  }
  return props;
}

export function parseHeadSnippet(html: string): SnippetTag[] {
  const tags: SnippetTag[] = [];
  const re =
    /<(meta|link)\b([^>]*?)\/?>|<(script|style|noscript)\b([^>]*)>([\s\S]*?)<\/\3\s*>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    if (m[1]) {
      tags.push({
        tag: m[1].toLowerCase() as "meta" | "link",
        props: parseAttrs(m[2]),
        inner: "",
      });
    } else {
      tags.push({
        tag: m[3].toLowerCase() as "script" | "style" | "noscript",
        props: parseAttrs(m[4]),
        inner: m[5],
      });
    }
  }
  return tags;
}
