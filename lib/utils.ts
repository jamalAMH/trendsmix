import type { StoryCategory } from "@/types/story";

const CATEGORY_GRADIENTS: Record<StoryCategory, string> = {
  horror: "from-red-950 via-rose-950/60 to-zinc-950",
  mystery: "from-indigo-950 via-violet-950/60 to-zinc-950",
  romance: "from-rose-950 via-pink-950/60 to-zinc-950",
  fantasy: "from-purple-950 via-fuchsia-950/60 to-zinc-950",
  "sci-fi": "from-cyan-950 via-blue-950/60 to-zinc-950",
  drama: "from-amber-950 via-orange-950/60 to-zinc-950",
};

const CATEGORY_ACCENT: Record<StoryCategory, string> = {
  horror: "text-red-400 bg-red-500/10 ring-red-500/20",
  mystery: "text-indigo-400 bg-indigo-500/10 ring-indigo-500/20",
  romance: "text-rose-400 bg-rose-500/10 ring-rose-500/20",
  fantasy: "text-purple-400 bg-purple-500/10 ring-purple-500/20",
  "sci-fi": "text-cyan-400 bg-cyan-500/10 ring-cyan-500/20",
  drama: "text-amber-400 bg-amber-500/10 ring-amber-500/20",
};

const CATEGORY_GLOW: Record<StoryCategory, string> = {
  horror: "rgba(239,68,68,0.18)",
  mystery: "rgba(129,140,248,0.18)",
  romance: "rgba(244,63,94,0.18)",
  fantasy: "rgba(192,132,252,0.18)",
  "sci-fi": "rgba(34,211,238,0.18)",
  drama: "rgba(251,146,60,0.18)",
};

export function formatCategory(category: string): string {
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
  return CATEGORY_GRADIENTS[category];
}

export function getCategoryAccent(category: StoryCategory): string {
  return CATEGORY_ACCENT[category];
}

export function getCategoryGlow(category: StoryCategory): string {
  return CATEGORY_GLOW[category];
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
