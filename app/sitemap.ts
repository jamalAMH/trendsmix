import type { MetadataRoute } from "next";
import { STORY_CATEGORIES } from "@/lib/constants";
import { getAllStories, getCategorySlugsWithPosts } from "@/lib/stories";
import { absoluteUrl } from "@/lib/seo";

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/stories", changeFrequency: "daily", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/disclaimer", changeFrequency: "yearly", priority: 0.3 },
  { path: "/cookies", changeFrequency: "yearly", priority: 0.3 },
  { path: "/editorial-policy", changeFrequency: "yearly", priority: 0.4 },
  { path: "/ai-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/dmca", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [stories, categorySlugs] = await Promise.all([
    getAllStories(),
    getCategorySlugsWithPosts(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(
    ({ path, changeFrequency, priority }) => ({
      url: absoluteUrl(path),
      lastModified: new Date(),
      changeFrequency,
      priority,
    }),
  );

  const categories =
    categorySlugs.length > 0 ? categorySlugs : [...STORY_CATEGORIES];

  const categoryEntries: MetadataRoute.Sitemap = categories.map((slug) => ({
    url: absoluteUrl(`/category/${slug}`),
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.85,
  }));

  const storyEntries: MetadataRoute.Sitemap = stories.map((story) => ({
    url: absoluteUrl(`/stories/${story.slug}`),
    lastModified: new Date(story.publishedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticEntries, ...categoryEntries, ...storyEntries];
}
