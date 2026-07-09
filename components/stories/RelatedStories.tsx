import type { Story } from "@/types/story";
import StoryGrid from "@/components/stories/StoryGrid";

interface RelatedStoriesProps {
  stories: Story[];
}

export default function RelatedStories({ stories }: RelatedStoriesProps) {
  if (stories.length === 0) {
    return null;
  }

  return (
    <StoryGrid
      stories={stories}
      title="Related Stories"
      description="More reads you might enjoy from the same world of fiction."
      viewAllHref="/stories"
    />
  );
}
