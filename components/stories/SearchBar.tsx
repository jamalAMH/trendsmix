interface SearchBarProps {
  placeholder?: string;
}

export default function SearchBar({
  placeholder = "Search stories by title or genre...",
}: SearchBarProps) {
  return (
    <form className="w-full" action="/stories" method="get">
      <label htmlFor="story-search" className="sr-only">
        Search stories
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
          <input
            id="story-search"
            name="q"
            type="search"
            placeholder={placeholder}
            className="w-full rounded-xl border border-zinc-700/80 bg-zinc-900/60 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-zinc-500 backdrop-blur-sm transition-colors focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-zinc-800 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-zinc-700"
        >
          Search
        </button>
      </div>
    </form>
  );
}
