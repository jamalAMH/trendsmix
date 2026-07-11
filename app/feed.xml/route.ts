import { getAllStories } from "@/lib/stories";
import { getSiteUrl } from "@/lib/seo";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const siteUrl = getSiteUrl();
  const stories = await getAllStories();

  const items = stories
    .map(
      (story) => `    <item>
      <title>${escapeXml(story.title)}</title>
      <link>${siteUrl}/stories/${story.slug}</link>
      <guid isPermaLink="true">${siteUrl}/stories/${story.slug}</guid>
      <description>${escapeXml(story.excerpt)}</description>
      <pubDate>${new Date(story.publishedAt).toUTCString()}</pubDate>
      ${story.category ? `<category>${escapeXml(story.category)}</category>` : ""}
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>TrendsMix</title>
    <link>${siteUrl}</link>
    <description>Gripping drama, revenge, and real-life inspired stories that keep you reading. Fresh fiction published daily.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
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
