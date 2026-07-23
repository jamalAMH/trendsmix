import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import StoryGrid from "@/components/stories/StoryGrid";
import Newsletter from "@/components/shared/Newsletter";
import JsonLd from "@/components/seo/JsonLd";
import {
  CATEGORY_SEO,
  SITE_NAME,
  STORY_CATEGORIES,
} from "@/lib/constants";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  createPageMetadata,
} from "@/lib/seo";
import {
  getStoriesByCategory,
  getCategorySlugsWithPosts,
} from "@/lib/stories";
import type { StoryCategory } from "@/types/story";
import { formatCategory } from "@/lib/utils";

export const revalidate = 60;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

function isStoryCategory(slug: string): slug is StoryCategory {
  return (STORY_CATEGORIES as readonly string[]).includes(slug);
}

export async function generateStaticParams() {
  const withPosts = await getCategorySlugsWithPosts();
  const slugs = withPosts.length > 0 ? withPosts : [...STORY_CATEGORIES];
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isStoryCategory(slug)) {
    return { title: "Category Not Found", robots: { index: false, follow: false } };
  }

  const seo = CATEGORY_SEO[slug];
  const stories = await getStoriesByCategory(slug);

  return createPageMetadata({
    title: seo.title,
    description: seo.description,
    path: `/category/${slug}`,
    noIndex: stories.length === 0,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  if (!isStoryCategory(slug)) notFound();

  const stories = await getStoriesByCategory(slug);
  const seo = CATEGORY_SEO[slug];
  const label = formatCategory(slug);
  const path = `/category/${slug}`;

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: seo.title,
    description: seo.description,
    url: absoluteUrl(path),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: absoluteUrl("/"),
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: stories.length,
      itemListElement: stories.slice(0, 20).map((story, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/stories/${story.slug}`),
        name: story.title,
      })),
    },
  };

  return (
    <>
      <JsonLd
        data={[
          collectionJsonLd,
          breadcrumbJsonLd([
            { name: "Home", item: absoluteUrl("/") },
            { name: "Stories", item: absoluteUrl("/stories") },
            { name: label, item: absoluteUrl(path) },
          ]),
        ]}
      />

      <header className="gradient-mesh border-b border-zinc-800/50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="text-sm text-zinc-500">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-orange-400">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/stories" className="hover:text-orange-400">
                  Stories
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-zinc-300" aria-current="page">
                {label}
              </li>
            </ol>
          </nav>

          <h1 className="font-display mt-6 text-4xl text-white sm:text-5xl">
            {seo.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400">
            {seo.description}
          </p>
          <p className="mt-3 text-sm text-zinc-500">
            {stories.length} {stories.length === 1 ? "story" : "stories"}
          </p>
        </div>
      </header>

      {stories.length > 0 ? (
        <StoryGrid
          stories={stories}
          title={`${label} Stories`}
          description={`Original ${label.toLowerCase()} fiction on ${SITE_NAME}, newest first.`}
        />
      ) : (
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-zinc-400">
            No published stories in this category yet.{" "}
            <Link href="/stories" className="text-orange-400 hover:text-orange-300">
              Browse all stories
            </Link>
            .
          </p>
        </div>
      )}

      <Newsletter />
    </>
  );
}
