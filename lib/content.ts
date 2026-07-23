import { createClient } from "@supabase/supabase-js";
import type { StoryCategory, Story } from "@/types/story";
import type { PostWithRelations } from "@/types/database";

function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

let _supabase: ReturnType<typeof createClient> | null = null;

function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return _supabase;
}

function postToStory(post: PostWithRelations): Story {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    category: (post.categories?.slug as StoryCategory) || undefined,
    readTime: post.read_time,
    publishedAt: post.published_at ?? post.created_at,
    featuredImage: {
      alt: post.featured_image_alt ?? "",
      src: post.featured_image ?? null,
    },
    author: {
      name:
        post.profiles?.full_name || post.profiles?.email || "TrendsMix",
      bio: "",
      role: undefined,
    },
    metaTitle: post.meta_title,
    metaDescription: post.meta_description,
    canonicalUrl: post.canonical_url,
    ogImage: post.og_image,
  };
}

export async function getAllStories(): Promise<Story[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = getSupabase();
  const { data } = await supabase
    .from("posts")
    .select("*, categories(*), profiles(*)")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return ((data as PostWithRelations[]) ?? []).map(postToStory);
}

export async function getAllStorySlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = getSupabase();
  const { data } = await supabase
    .from("posts")
    .select("slug")
    .eq("status", "published");

  return (data ?? []).map((p: { slug: string }) => p.slug);
}

export async function getStoryBySlug(
  slug: string,
): Promise<Story | undefined> {
  if (!isSupabaseConfigured()) return undefined;
  const supabase = getSupabase();
  const { data } = await supabase
    .from("posts")
    .select("*, categories(*), profiles(*)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!data) return undefined;
  return postToStory(data as PostWithRelations);
}

export async function getFeaturedStory(): Promise<Story> {
  if (!isSupabaseConfigured()) {
    return {
      slug: "setup-required",
      title: "Connect Supabase",
      excerpt: "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment to load stories.",
      content: "<p>Run the SQL schema and configure your environment variables to get started.</p>",
      readTime: 1,
      publishedAt: new Date().toISOString(),
      featuredImage: { alt: "", src: null },
      author: { name: "TrendsMix", bio: "" },
    };
  }
  const supabase = getSupabase();

  const { data: featured } = await supabase
    .from("posts")
    .select("*, categories(*), profiles(*)")
    .eq("status", "published")
    .eq("featured", true)
    .order("published_at", { ascending: false })
    .limit(1)
    .single();

  if (featured) return postToStory(featured as PostWithRelations);

  const { data: latest } = await supabase
    .from("posts")
    .select("*, categories(*), profiles(*)")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(1)
    .single();

  if (!latest) {
    return {
      slug: "no-posts-yet",
      title: "Welcome to TrendsMix",
      excerpt: "No published posts yet. Head to the admin dashboard to create your first post.",
      content: "<p>Log in at <a href='/admin'>/admin</a> and create your first post to get started.</p>",
      readTime: 1,
      publishedAt: new Date().toISOString(),
      featuredImage: { alt: "", src: null },
      author: { name: "TrendsMix", bio: "" },
    };
  }
  return postToStory(latest as PostWithRelations);
}

export async function getLatestStories(limit = 3): Promise<Story[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = getSupabase();
  const { data } = await supabase
    .from("posts")
    .select("*, categories(*), profiles(*)")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);

  return ((data as PostWithRelations[]) ?? []).map(postToStory);
}

export async function getTrendingStories(limit = 3): Promise<Story[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = getSupabase();
  const { data } = await supabase
    .from("posts")
    .select("*, categories(*), profiles(*)")
    .eq("status", "published")
    .order("read_time", { ascending: false })
    .limit(limit);

  return ((data as PostWithRelations[]) ?? []).map(postToStory);
}

export async function getAdjacentStories(
  slug: string,
): Promise<{ prev: Story | null; next: Story | null }> {
  if (!isSupabaseConfigured()) return { prev: null, next: null };
  const supabase = getSupabase();

  const { data: current } = await supabase
    .from("posts")
    .select("published_at")
    .eq("slug", slug)
    .eq("status", "published")
    .single<{ published_at: string | null }>();

  if (!current?.published_at) return { prev: null, next: null };

  const [{ data: prevData }, { data: nextData }] = await Promise.all([
    supabase
      .from("posts")
      .select("*, categories(*), profiles(*)")
      .eq("status", "published")
      .lt("published_at", current.published_at)
      .order("published_at", { ascending: false })
      .limit(1)
      .single<PostWithRelations>(),
    supabase
      .from("posts")
      .select("*, categories(*), profiles(*)")
      .eq("status", "published")
      .gt("published_at", current.published_at)
      .order("published_at", { ascending: true })
      .limit(1)
      .single<PostWithRelations>(),
  ]);

  return {
    prev: prevData ? postToStory(prevData as PostWithRelations) : null,
    next: nextData ? postToStory(nextData as PostWithRelations) : null,
  };
}

export async function getRelatedStories(
  slug: string,
  limit = 3,
): Promise<Story[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = getSupabase();

  const { data: current } = await supabase
    .from("posts")
    .select("category_id")
    .eq("slug", slug)
    .eq("status", "published")
    .single<{ category_id: string | null }>();

  if (!current) return [];

  let query = supabase
    .from("posts")
    .select("*, categories(*), profiles(*)")
    .eq("status", "published")
    .neq("slug", slug)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (current.category_id) {
    query = query.eq("category_id", current.category_id);
  }

  const { data: related } = await query;

  const stories = ((related as PostWithRelations[]) ?? []).map(postToStory);

  // Fallback: if category has too few posts, fill with latest
  if (stories.length < limit) {
    const exclude = new Set([slug, ...stories.map((s) => s.slug)]);
    const { data: latest } = await supabase
      .from("posts")
      .select("*, categories(*), profiles(*)")
      .eq("status", "published")
      .neq("slug", slug)
      .order("published_at", { ascending: false })
      .limit(limit * 2);

    for (const post of (latest as PostWithRelations[]) ?? []) {
      if (exclude.has(post.slug)) continue;
      stories.push(postToStory(post));
      if (stories.length >= limit) break;
    }
  }

  return stories.slice(0, limit);
}

export async function getStoriesByCategory(
  categorySlug: string,
): Promise<Story[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = getSupabase();

  const { data } = await supabase
    .from("posts")
    .select("*, categories!inner(*), profiles(*)")
    .eq("status", "published")
    .eq("categories.slug", categorySlug)
    .order("published_at", { ascending: false });

  return ((data as PostWithRelations[]) ?? []).map(postToStory);
}

export async function getCategorySlugsWithPosts(): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = getSupabase();

  const { data } = await supabase
    .from("posts")
    .select("categories!inner(slug)")
    .eq("status", "published");

  const slugs = new Set<string>();
  for (const row of data ?? []) {
    const cat = (row as { categories?: { slug?: string } | null }).categories;
    if (cat?.slug) slugs.add(cat.slug);
  }
  return [...slugs];
}

export async function searchStories(query: string): Promise<Story[]> {
  const q = query.trim().toLowerCase();
  if (!q) return getAllStories();

  const stories = await getAllStories();
  return stories.filter((story) => {
    const haystack = [
      story.title,
      story.excerpt,
      story.category ?? "",
      story.author.name,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
