import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath = "/stories",
}: PaginationProps) {
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav
      aria-label="Story pagination"
      className="flex items-center justify-center gap-4"
    >
      {hasPrevious ? (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          className="rounded-xl border border-zinc-700/80 bg-zinc-900/40 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-all hover:border-orange-500/30 hover:text-white"
        >
          Previous
        </Link>
      ) : (
        <span className="rounded-xl border border-zinc-800/60 px-5 py-2.5 text-sm font-medium text-zinc-600">
          Previous
        </span>
      )}

      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Link
            key={page}
            href={`${basePath}?page=${page}`}
            className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-medium transition-all ${
              page === currentPage
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                : "border border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white"
            }`}
          >
            {page}
          </Link>
        ))}
      </div>

      {hasNext ? (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="rounded-xl border border-zinc-700/80 bg-zinc-900/40 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-all hover:border-orange-500/30 hover:text-white"
        >
          Next
        </Link>
      ) : (
        <span className="rounded-xl border border-zinc-800/60 px-5 py-2.5 text-sm font-medium text-zinc-600">
          Next
        </span>
      )}
    </nav>
  );
}
