import Link from "next/link";
import type { Story } from "@/types/story";
import ReadingTimeBadge from "@/components/shared/ReadingTimeBadge";
import { formatDate } from "@/lib/utils";

interface FeaturedStoryProps {
  story: Story;
}

export default function FeaturedStory({ story }: FeaturedStoryProps) {
  const hasImage = story.featuredImage?.src;

  return (
    <Link
      href={`/stories/${story.slug}`}
      className="card-shine group relative flex flex-col overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/40 shadow-2xl shadow-black/40 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/30 hover:shadow-orange-500/10"
    >
      <div className="relative aspect-[16/10] bg-gradient-to-br from-orange-950 via-zinc-900 to-zinc-950">
        {hasImage && (
          <img
            src={story.featuredImage.src!}
            alt={story.featuredImage.alt || story.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(249,115,22,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2 sm:left-6 sm:top-6">
          <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-orange-500/30">
            Featured
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <h2 className="font-display text-2xl leading-tight text-white transition-colors group-hover:text-orange-300 sm:text-3xl lg:text-4xl">
            {story.title}
          </h2>
          <p className="mt-3 line-clamp-2 max-w-xl text-sm leading-relaxed text-zinc-300 sm:text-base">
            {story.excerpt}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <ReadingTimeBadge minutes={story.readTime} />
            <time
              dateTime={story.publishedAt}
              className="text-xs font-medium text-zinc-400"
            >
              {formatDate(story.publishedAt)}
            </time>
          </div>
        </div>
      </div>
    </Link>
  );
}
