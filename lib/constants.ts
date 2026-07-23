export const SITE_NAME = "TrendsMix";

export const SITE_URL = "https://www.trendsmix.online";

export const SITE_DOMAIN = "trendsmix.online";

export const SITE_DESCRIPTION =
  "Original short fiction across drama, mystery, romance, and more. Fresh stories published daily on TrendsMix — free to read.";

export const SITE_KEYWORDS = [
  "fiction",
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
  "horror",
  "mystery",
  "romance",
  "fantasy",
  "sci-fi",
  "drama",
] as const;

export const CATEGORY_SEO: Record<
  (typeof STORY_CATEGORIES)[number],
  { title: string; description: string }
> = {
  horror: {
    title: "Horror Short Stories",
    description:
      "Read original horror short stories on TrendsMix — suspense, dread, and twists that stay with you.",
  },
  mystery: {
    title: "Mystery Short Stories",
    description:
      "Original mystery and thriller short fiction — secrets, clues, and stories that keep you guessing.",
  },
  romance: {
    title: "Romance Short Stories",
    description:
      "Heartfelt romance short stories — love, heartbreak, and relationships told in one sitting.",
  },
  fantasy: {
    title: "Fantasy Short Stories",
    description:
      "Original fantasy short fiction — magic, myth, and worlds beyond the everyday.",
  },
  "sci-fi": {
    title: "Sci-Fi Short Stories",
    description:
      "Science fiction short stories — future worlds, technology, and speculative fiction on TrendsMix.",
  },
  drama: {
    title: "Drama Short Stories",
    description:
      "Emotional drama short stories — relationships, revenge, family secrets, and life-changing moments.",
  },
};

export const FOOTER_CATEGORY_LINKS = STORY_CATEGORIES.map((slug) => ({
  href: `/category/${slug}`,
  label: slug === "sci-fi" ? "Sci-Fi" : slug.charAt(0).toUpperCase() + slug.slice(1),
}));
