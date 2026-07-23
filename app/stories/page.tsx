import type { Metadata } from "next";
import Link from "next/link";
import StoryGrid from "@/components/stories/StoryGrid";
import SearchBar from "@/components/stories/SearchBar";
import Newsletter from "@/components/shared/Newsletter";
import { CATEGORY_SEO, STORY_CATEGORIES } from "@/lib/constants";
import { createPageMetadata } from "@/lib/seo";
import { getAllStories, searchStories } from "@/lib/stories";
import { formatCategory } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = createPageMetadata({
  title: "All Stories",
  description:
    "Browse the full TrendsMix library of original fiction across horror, mystery, romance, fantasy, sci-fi, and drama.",
  path: "/stories",
});

interface StoriesPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function StoriesPage({ searchParams }: StoriesPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const stories = query ? await searchStories(query) : await getAllStories();

  return (
    <>
      <header className="gradient-mesh border-b border-zinc-800/50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <span className="inline-block rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-400 ring-1 ring-orange-500/20">
            Library
          </span>
          <h1 className="font-display mt-4 text-4xl text-white sm:text-5xl">
            All Stories
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400">
            Browse our full collection of original fiction across horror, mystery,
            romance, fantasy, and more.
          </p>

          <div className="mt-8 max-w-xl">
            <SearchBar defaultValue={query} />
          </div>

          <nav
            aria-label="Browse by genre"
            className="mt-8 flex flex-wrap gap-2"
          >
            {STORY_CATEGORIES.map((slug) => (
              <Link
                key={slug}
                href={`/category/${slug}`}
                className="rounded-full border border-zinc-700/80 bg-zinc-900/50 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-orange-500/40 hover:text-orange-400"
                title={CATEGORY_SEO[slug].title}
              >
                {formatCategory(slug)}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <StoryGrid
        stories={stories}
        title={query ? `Results for “${query}”` : "Every Story"}
        description={
          query
            ? `${stories.length} ${stories.length === 1 ? "story" : "stories"} matched your search.`
            : "Every published story on TrendsMix, sorted by newest first."
        }
      />

      <Newsletter />
    </>
  );
}
