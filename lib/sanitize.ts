const ALLOWED_TAGS = new Set([
  "p", "br", "b", "strong", "i", "em", "u", "s", "a",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li", "blockquote", "pre", "code",
  "img", "figure", "figcaption", "hr", "span", "div",
  "table", "thead", "tbody", "tr", "th", "td",
  "sub", "sup", "mark",
]);

const ALLOWED_ATTRS = new Set([
  "href", "target", "rel", "src", "alt", "width", "height",
  "class", "id", "style", "title",
]);

const VOID_TAGS = new Set([
  "br", "hr", "img", "input", "meta", "link",
]);

export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]*)/gi, "")
    .replace(/javascript\s*:/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object[\s\S]*?<\/object>/gi, "")
    .replace(/<embed[\s\S]*?\/?>/gi, "")
    .replace(/<form[\s\S]*?<\/form>/gi, "");
}
