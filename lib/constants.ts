export const SITE_NAME = "TrendsMix";

export const SITE_URL = "https://www.trendmiix.online";

export const SITE_DOMAIN = "trendmiix.online";

export const SITE_DESCRIPTION =
  "Drama stories, health & wellness guides and lifestyle reads. Free to read on TrendsMix.";

export const SITE_KEYWORDS = [
  "short stories",
  "drama stories",
  "revenge stories",
  "relationship stories",
  "life stories",
  "viral stories",
  "online magazine",
  "TrendsMix",
];

export const TWITTER_HANDLE = "@TrendsMix";

export const HEADER_HEIGHT = 65;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/stories", label: "Stories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const FOOTER_COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/editorial-policy", label: "Editorial Policy" },
] as const;

export const FOOTER_LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/cookies", label: "Cookie Policy" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/ai-policy", label: "AI Content Policy" },
  { href: "/dmca", label: "DMCA Policy" },
] as const;

export const STORY_CATEGORIES = [
  "drama",
  "health-wellness",
  "lifestyle",
] as const;

export const CATEGORY_SEO: Record<
  (typeof STORY_CATEGORIES)[number],
  { title: string; description: string }
> = {
  drama: {
    title: "Drama Short Stories",
    description:
      "Emotional drama short stories — relationships, revenge, family secrets, and life-changing moments.",
  },
  "health-wellness": {
    title: "Health & Wellness",
    description:
      "Everyday health, skincare and wellness guides for general information only — not medical advice. Always consult a qualified professional.",
  },
  lifestyle: {
    title: "Lifestyle",
    description:
      "Practical home tips, trends, curiosities and everyday explainers from TrendsMix.",
  },
};

// Health & Wellness has no published posts right now, so keep it out of the
// footer; add it back here once it has articles again.
export const FOOTER_CATEGORY_LINKS = STORY_CATEGORIES.filter(
  (slug) => slug !== "health-wellness",
).map((slug) => ({
  href: `/category/${slug}`,
  label: CATEGORY_SEO[slug].title.replace(/ Short Stories$/, ""),
}));
