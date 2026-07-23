import type { Metadata } from "next";
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_URL,
  TWITTER_HANDLE,
} from "@/lib/constants";
import type { Story } from "@/types/story";

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL;
  return url.replace(/\/$/, "");
}

export function absoluteUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
}

export function createMetadataBase(): Metadata {
  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    keywords: SITE_KEYWORDS,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: getSiteUrl() }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: getSiteUrl(),
      siteName: SITE_NAME,
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: "/",
      types: {
        "application/rss+xml": `${getSiteUrl()}/feed.xml`,
      },
    },
    category: "entertainment",
  };
}

export function createPageMetadata({
  title,
  description,
  path,
  openGraphType = "website",
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  openGraphType?: "website" | "article";
  noIndex?: boolean;
}): Metadata {
  const canonical = absoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical,
      types: {
        "application/rss+xml": `${getSiteUrl()}/feed.xml`,
      },
    },
    openGraph: {
      type: openGraphType,
      url: canonical,
      title,
      description,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: false,
          },
        }
      : {}),
  };
}

export function createStoryMetadata(story: Story): Metadata {
  const path = `/stories/${story.slug}`;
  const canonical = story.canonicalUrl || absoluteUrl(path);
  const title = story.metaTitle || story.title;
  const description = story.metaDescription || story.excerpt;

  return {
    title,
    description,
    authors: [{ name: story.author.name }],
    alternates: {
      canonical,
      types: {
        "application/rss+xml": `${getSiteUrl()}/feed.xml`,
      },
    },
    openGraph: {
      type: "article",
      url: canonical,
      title,
      description,
      siteName: SITE_NAME,
      publishedTime: story.publishedAt,
      authors: [story.author.name],
      ...(story.category ? { tags: [story.category] } : {}),
      ...(story.ogImage ? { images: [{ url: story.ogImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: TWITTER_HANDLE,
      ...(story.ogImage ? { images: [story.ogImage] } : {}),
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: getSiteUrl(),
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${getSiteUrl()}/stories?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function articleJsonLd(story: Story) {
  const imageUrl =
    story.ogImage || story.featuredImage.src || undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.title,
    description: story.excerpt,
    datePublished: story.publishedAt,
    dateModified: story.publishedAt,
    ...(imageUrl ? { image: imageUrl } : {}),
    author: {
      "@type": "Person",
      name: story.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: getSiteUrl(),
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/icon"),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/stories/${story.slug}`),
    },
    ...(story.category
      ? {
          articleSection: formatCategoryLabel(story.category),
          about: {
            "@type": "Thing",
            name: formatCategoryLabel(story.category),
          },
        }
      : {}),
    inLanguage: "en-US",
  };
}

function formatCategoryLabel(category: string): string {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; item?: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      ...(entry.item ? { item: entry.item } : {}),
    })),
  };
}
