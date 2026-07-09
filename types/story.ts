export type StoryCategory =
  | "horror"
  | "mystery"
  | "romance"
  | "fantasy"
  | "sci-fi"
  | "drama";

export interface Author {
  name: string;
  bio: string;
  role?: string;
}

export interface FeaturedImage {
  alt: string;
  src: string | null;
}

export interface Story {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: StoryCategory;
  readTime: number;
  publishedAt: string;
  featuredImage: FeaturedImage;
  author: Author;
}

/** On-disk format for public/data/stories.json (n8n writes this file). */
export type StoriesFile = Story[];

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/**
 * Content repository contract. UI and pages depend on these functions only.
 * Swap the implementation in lib/content.ts (JSON → Supabase/REST) without
 * touching components or routes.
 */
export interface StoryRepository {
  getAllStories(): Story[];
  getAllStorySlugs(): string[];
  getStoryBySlug(slug: string): Story | undefined;
  getFeaturedStory(): Story;
  getLatestStories(limit?: number): Story[];
  getTrendingStories(limit?: number): Story[];
  getAdjacentStories(slug: string): { prev: Story | null; next: Story | null };
  getRelatedStories(slug: string, limit?: number): Story[];
}
