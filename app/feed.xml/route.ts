import { getAllStories } from "@/lib/stories";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://trendsmix.com";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const stories = await getAllStories();

  const items = stories
    .map(
      (story) => `    <item>
      <title>${escapeXml(story.title)}</title>
      <link>${SITE_URL}/stories/${story.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/stories/${story.slug}</guid>
      <description>${escapeXml(story.excerpt)}</description>
      <pubDate>${new Date(story.publishedAt).toUTCString()}</pubDate>
      <category>${escapeXml(story.category)}</category>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>TrendsMix</title>
    <link>${SITE_URL}</link>
    <description>Immersive storytelling across genres — horror, mystery, romance, fantasy, sci-fi, and drama.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
