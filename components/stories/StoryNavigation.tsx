import Link from "next/link";
import type { Story } from "@/types/story";
import { formatCategory } from "@/lib/utils";

interface StoryNavigationProps {
  prev: Story | null;
  next: Story | null;
}

export default function StoryNavigation({ prev, next }: StoryNavigationProps) {
  return (
    <nav
      aria-label="Story navigation"
      className="grid gap-4 border-t border-zinc-800/80 pt-10 sm:grid-cols-2"
    >
      {prev ? (
        <Link
          href={`/stories/${prev.slug}`}
          className="group rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-5 transition-all hover:border-orange-500/25 hover:bg-zinc-900/60"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Previous
          </span>
          <p className="mt-2 font-display text-lg text-white transition-colors group-hover:text-orange-400">
            {prev.title}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {formatCategory(prev.category)}
          </p>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`/stories/${next.slug}`}
          className="group rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-5 text-left transition-all hover:border-orange-500/25 hover:bg-zinc-900/60 sm:text-right"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Next
          </span>
          <p className="mt-2 font-display text-lg text-white transition-colors group-hover:text-orange-400">
            {next.title}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {formatCategory(next.category)}
          </p>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
