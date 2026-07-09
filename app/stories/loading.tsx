function LoadingPulse({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-xl bg-zinc-800/80 ${className ?? ""}`}
    />
  );
}

export default function StoriesLoading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading stories</span>
      <div className="gradient-mesh border-b border-zinc-800/50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <LoadingPulse className="h-6 w-24" />
          <LoadingPulse className="mt-6 h-12 w-full max-w-md" />
          <LoadingPulse className="mt-4 h-5 w-full max-w-2xl" />
          <LoadingPulse className="mt-8 h-12 w-full max-w-xl" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <LoadingPulse key={index} className="h-72" />
          ))}
        </div>
      </div>
    </div>
  );
}
