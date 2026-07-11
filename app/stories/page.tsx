import type { Metadata } from "next";
import StoryGrid from "@/components/stories/StoryGrid";
import SearchBar from "@/components/stories/SearchBar";
import Pagination from "@/components/stories/Pagination";
import Newsletter from "@/components/shared/Newsletter";
import { createPageMetadata } from "@/lib/seo";
import { getAllStories } from "@/lib/stories";

export const revalidate = 60;

export const metadata: Metadata = createPageMetadata({
  title: "All Stories",
  description:
    "Browse the full TrendsMix library of original fiction across horror, mystery, romance, fantasy, sci-fi, and drama.",
  path: "/stories",
});

export default async function StoriesPage() {
  const stories = await getAllStories();

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
            <SearchBar />
          </div>
        </div>
      </header>

      <StoryGrid
        stories={stories}
        title="Every Story"
        description="Every published story on TrendsMix, sorted by newest first."
      />

      <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <Pagination currentPage={1} totalPages={3} />
      </div>

      <Newsletter />
    </>
  );
}
