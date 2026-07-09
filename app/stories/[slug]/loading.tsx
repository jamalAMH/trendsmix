function LoadingPulse({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-xl bg-zinc-800/80 ${className ?? ""}`}
    />
  );
}

export default function StoryLoading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading story</span>
      <LoadingPulse className="aspect-[21/9] min-h-[280px] w-full rounded-none sm:min-h-[360px]" />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <LoadingPulse className="h-10 w-40" />
        <div className="mt-10 space-y-4">
          <LoadingPulse className="h-4 w-full" />
          <LoadingPulse className="h-4 w-full" />
          <LoadingPulse className="h-4 w-5/6" />
          <LoadingPulse className="h-4 w-full" />
          <LoadingPulse className="h-4 w-4/5" />
        </div>
      </div>
    </div>
  );
}
