import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { StoriesFile, Story } from "@/types/story";

const STORIES_PATH = join(process.cwd(), "public/data/stories.json");

let storiesCache: Story[] | null = null;

function readStoriesFromDisk(): Story[] {
  const raw = readFileSync(STORIES_PATH, "utf-8");
  const parsed = JSON.parse(raw) as StoriesFile;

  if (!Array.isArray(parsed)) {
    throw new Error(
      "Invalid stories.json: expected a JSON array of story objects.",
    );
  }

  return parsed;
}

/** Load stories from public/data/stories.json (refreshed in dev on each read). */
function loadStories(): Story[] {
  if (process.env.NODE_ENV === "development") {
    return readStoriesFromDisk();
  }

  if (!storiesCache) {
    storiesCache = readStoriesFromDisk();
  }

  return storiesCache;
}

function sortByNewest(stories: Story[]): Story[] {
  return [...stories].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getAllStories(): Story[] {
  return sortByNewest(loadStories());
}

export function getAllStorySlugs(): string[] {
  return loadStories().map((story) => story.slug);
}

export function getStoryBySlug(slug: string): Story | undefined {
  return loadStories().find((story) => story.slug === slug);
}

export function getFeaturedStory(): Story {
  const stories = getAllStories();

  if (stories.length === 0) {
    throw new Error("No stories found in public/data/stories.json");
  }

  return stories[0];
}

export function getLatestStories(limit = 3): Story[] {
  return getAllStories().slice(0, limit);
}

export function getTrendingStories(limit = 3): Story[] {
  return [...loadStories()]
    .sort((a, b) => b.readTime - a.readTime)
    .slice(0, limit);
}

export function getAdjacentStories(slug: string): {
  prev: Story | null;
  next: Story | null;
} {
  const ordered = getAllStories();
  const index = ordered.findIndex((story) => story.slug === slug);

  if (index === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: index > 0 ? ordered[index - 1] : null,
    next: index < ordered.length - 1 ? ordered[index + 1] : null,
  };
}

export function getRelatedStories(slug: string, limit = 3): Story[] {
  const story = getStoryBySlug(slug);

  if (!story) {
    return [];
  }

  const all = loadStories();
  const sameCategory = all.filter(
    (item) => item.slug !== slug && item.category === story.category,
  );
  const others = all.filter(
    (item) => item.slug !== slug && item.category !== story.category,
  );

  return [...sameCategory, ...others].slice(0, limit);
}
