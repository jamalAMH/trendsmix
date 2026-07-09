function LoadingPulse({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-xl bg-zinc-800/80 ${className ?? ""}`}
    />
  );
}

export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <span className="sr-only">Loading page content</span>
      <LoadingPulse className="h-6 w-28" />
      <LoadingPulse className="mt-6 h-12 w-full max-w-xl" />
      <LoadingPulse className="mt-4 h-5 w-full max-w-2xl" />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <LoadingPulse key={index} className="h-72" />
        ))}
      </div>
    </div>
  );
}
