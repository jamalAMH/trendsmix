export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "editor";
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category_id: string | null;
  author_id: string | null;
  status: "draft" | "published";
  featured: boolean;
  read_time: number;
  featured_image: string | null;
  featured_image_alt: string;
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  og_image: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PostWithRelations extends Post {
  categories: Category | null;
  profiles: Profile | null;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Setting {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

export interface Media {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploaded_by: string | null;
  created_at: string;
}

export interface PageView {
  id: string;
  path: string;
  referrer: string;
  source: string;
  country: string;
  city: string | null;
  session_id: string | null;
  user_agent: string;
  created_at: string;
}

export interface ActiveSession {
  session_id: string;
  path: string;
  referrer: string;
  source: string;
  country: string;
  last_seen: string;
}
