import type { StoryCategory } from "@/types/story";

const CATEGORY_GRADIENTS: Record<StoryCategory, string> = {
  drama: "from-amber-950 via-orange-950/60 to-zinc-950",
  "health-wellness": "from-emerald-950 via-teal-950/60 to-zinc-950",
  lifestyle: "from-sky-950 via-blue-950/60 to-zinc-950",
};

const CATEGORY_ACCENT: Record<StoryCategory, string> = {
  drama: "text-amber-400 bg-amber-500/10 ring-amber-500/20",
  "health-wellness": "text-emerald-400 bg-emerald-500/10 ring-emerald-500/20",
  lifestyle: "text-sky-400 bg-sky-500/10 ring-sky-500/20",
};

const CATEGORY_GLOW: Record<StoryCategory, string> = {
  drama: "rgba(251,146,60,0.18)",
  "health-wellness": "rgba(52,211,153,0.18)",
  lifestyle: "rgba(56,189,248,0.18)",
};

export function formatCategory(category: string): string {
  if (category === "health-wellness") return "Health & Wellness";
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function getCategoryGradient(category: StoryCategory): string {
  return CATEGORY_GRADIENTS[category] ?? CATEGORY_GRADIENTS.drama;
}

export function getCategoryAccent(category: StoryCategory): string {
  return CATEGORY_ACCENT[category] ?? CATEGORY_ACCENT.drama;
}

export function getCategoryGlow(category: StoryCategory): string {
  return CATEGORY_GLOW[category] ?? CATEGORY_GLOW.drama;
}

export function getAuthorInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function cn(...classes: (string | false | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
