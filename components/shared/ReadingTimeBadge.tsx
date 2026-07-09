interface ReadingTimeBadgeProps {
  minutes: number;
  className?: string;
}

export default function ReadingTimeBadge({
  minutes,
  className = "",
}: ReadingTimeBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-zinc-900/80 px-2.5 py-1 text-xs font-medium text-zinc-300 ring-1 ring-zinc-700/80 backdrop-blur-sm ${className}`}
    >
      <svg
        aria-hidden="true"
        className="h-3.5 w-3.5 text-orange-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
        />
      </svg>
      {minutes} min read
    </span>
  );
}
