import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import StoryGrid from "@/components/stories/StoryGrid";
import { SITE_DESCRIPTION } from "@/lib/constants";
import { createPageMetadata } from "@/lib/seo";
import {
  getFeaturedStory,
  getLatestStories,
  getTrendingStories,
} from "@/lib/stories";

export const revalidate = 60;

export const metadata: Metadata = createPageMetadata({
  title: "Gripping Stories That Keep You Reading",
  description: SITE_DESCRIPTION,
  path: "/",
});

export default async function Home() {
  const featuredStory = await getFeaturedStory();
  const latestStories = await getLatestStories(3);
  const trendingStories = await getTrendingStories(3);

  return (
    <>
      <Hero featuredStory={featuredStory} />

      <StoryGrid
        stories={latestStories}
        title="Latest Stories"
        description="The newest fiction on TrendsMix — just published and ready to read."
        viewAllHref="/stories"
      />

      <div className="border-t border-zinc-800/50">
        <StoryGrid
          stories={trendingStories}
          title="Trending Stories"
          description="The reads capturing attention this week across every genre."
          viewAllHref="/stories"
          variant="trending"
        />
      </div>

    </>
  );
}
