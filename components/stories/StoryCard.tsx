import Link from "next/link";
import type { Story } from "@/types/story";
import ReadingTimeBadge from "@/components/shared/ReadingTimeBadge";
import CategoryBadge from "@/components/shared/CategoryBadge";
import { formatDate } from "@/lib/utils";

interface StoryCardProps {
  story: Story;
  priority?: boolean;
}

export default function StoryCard({ story, priority = false }: StoryCardProps) {
  const hasImage = story.featuredImage?.src;

  return (
    <article
      className={`card-shine group flex flex-col overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/30 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/25 hover:shadow-xl hover:shadow-orange-500/5 ${priority ? "lg:flex-row lg:items-stretch" : ""}`}
    >
      <Link
        href={`/stories/${story.slug}`}
        className={`relative block overflow-hidden ${priority ? "lg:w-2/5" : "aspect-[16/10]"}`}
      >
        {hasImage ? (
          <img
            src={story.featuredImage.src!}
            alt={story.featuredImage.alt || story.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading={priority ? "eager" : "lazy"}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-orange-950 via-zinc-900 to-zinc-950 transition-transform duration-500 group-hover:scale-105" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
      </Link>

      <div className={`flex flex-1 flex-col p-5 sm:p-6 ${priority ? "lg:justify-center" : ""}`}>
        <div className="flex flex-wrap items-center gap-2">
          {story.category && <CategoryBadge category={story.category} />}
          <ReadingTimeBadge minutes={story.readTime} />
          <time
            dateTime={story.publishedAt}
            className="text-xs text-zinc-500"
          >
            {formatDate(story.publishedAt)}
          </time>
        </div>

        <h2 className="mt-4 font-display text-xl leading-snug text-white transition-colors group-hover:text-orange-400 sm:text-2xl">
          <Link href={`/stories/${story.slug}`}>{story.title}</Link>
        </h2>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400 line-clamp-3">
          {story.excerpt}
        </p>

        <Link
          href={`/stories/${story.slug}`}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-400 transition-colors hover:text-orange-300"
        >
          Read story
          <svg
            aria-hidden="true"
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>
    </article>
  );
}
