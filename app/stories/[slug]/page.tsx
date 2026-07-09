import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CategoryBadge from "@/components/shared/CategoryBadge";
import ReadingTimeBadge from "@/components/shared/ReadingTimeBadge";
import JsonLd from "@/components/seo/JsonLd";
import ReadingProgress from "@/components/stories/ReadingProgress";
import ShareButtons from "@/components/stories/ShareButtons";
import StoryNavigation from "@/components/stories/StoryNavigation";
import RelatedStories from "@/components/stories/RelatedStories";
import {
  absoluteUrl,
  articleJsonLd,
  breadcrumbJsonLd,
  createStoryMetadata,
} from "@/lib/seo";
import {
  getAdjacentStories,
  getAllStorySlugs,
  getRelatedStories,
  getStoryBySlug,
} from "@/lib/stories";
import { formatDate, getCategoryGradient } from "@/lib/utils";

interface StoryDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllStorySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: StoryDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = getStoryBySlug(slug);

  if (!story) {
    return {
      title: "Story Not Found",
      robots: { index: false, follow: false },
    };
  }

  return createStoryMetadata(story);
}

export default async function StoryDetailsPage({
  params,
}: StoryDetailsPageProps) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  const { prev, next } = getAdjacentStories(slug);
  const relatedStories = getRelatedStories(slug, 3);
  const storyUrl = absoluteUrl(`/stories/${story.slug}`);

  return (
    <>
      <JsonLd
        data={[
          articleJsonLd(story),
          breadcrumbJsonLd([
            { name: "Home", item: absoluteUrl("/") },
            { name: "Stories", item: absoluteUrl("/stories") },
            { name: story.title, item: storyUrl },
          ]),
        ]}
      />

      <ReadingProgress />

      <article itemScope itemType="https://schema.org/Article">
        <header className="relative">
          <nav aria-label="Breadcrumb" className="sr-only">
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/stories">Stories</Link>
              </li>
              <li aria-current="page">{story.title}</li>
            </ol>
          </nav>

          <div
            className={`relative aspect-[21/9] min-h-[280px] bg-gradient-to-br sm:min-h-[360px] ${getCategoryGradient(story.category)}`}
            role="img"
            aria-label={story.featuredImage.alt}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(249,115,22,0.12),transparent_55%)]" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 mx-auto max-w-3xl px-4 pb-10 pt-24 sm:px-6 lg:px-8">
              <Link
                href="/stories"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
              >
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Stories
              </Link>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <CategoryBadge category={story.category} />
                <ReadingTimeBadge minutes={story.readTime} />
                <time
                  dateTime={story.publishedAt}
                  className="text-sm text-zinc-400"
                  itemProp="datePublished"
                >
                  {formatDate(story.publishedAt)}
                </time>
              </div>

              <h1
                className="font-display mt-5 text-3xl leading-tight text-white sm:text-4xl lg:text-5xl"
                itemProp="headline"
              >
                {story.title}
              </h1>

              <p
                className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-300"
                itemProp="description"
              >
                {story.excerpt}
              </p>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <ShareButtons />

          <div
            className="article-body mt-10 text-base leading-[1.85] text-zinc-300 sm:text-lg"
            itemProp="articleBody"
          >
            {story.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <footer className="mt-12 border-t border-zinc-800/80 pt-10">
            <address
              className="not-italic"
              itemProp="author"
              itemScope
              itemType="https://schema.org/Person"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Written by
              </p>
              <p className="mt-2 text-lg font-semibold text-white" itemProp="name">
                {story.author.name}
              </p>
              {story.author.role && (
                <p className="mt-1 text-sm text-zinc-400">{story.author.role}</p>
              )}
              <p className="mt-3 text-sm leading-relaxed text-zinc-400" itemProp="description">
                {story.author.bio}
              </p>
            </address>

            <div className="mt-10">
              <StoryNavigation prev={prev} next={next} />
            </div>
          </footer>
        </div>
      </article>

      <RelatedStories stories={relatedStories} />
    </>
  );
}
