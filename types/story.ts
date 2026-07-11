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
  content: string;
  category: StoryCategory;
  readTime: number;
  publishedAt: string;
  featuredImage: FeaturedImage;
  author: Author;
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  ogImage?: string | null;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface StoryRepository {
  getAllStories(): Promise<Story[]>;
  getAllStorySlugs(): Promise<string[]>;
  getStoryBySlug(slug: string): Promise<Story | undefined>;
  getFeaturedStory(): Promise<Story>;
  getLatestStories(limit?: number): Promise<Story[]>;
  getTrendingStories(limit?: number): Promise<Story[]>;
  getAdjacentStories(
    slug: string,
  ): Promise<{ prev: Story | null; next: Story | null }>;
  getRelatedStories(slug: string, limit?: number): Promise<Story[]>;
}
