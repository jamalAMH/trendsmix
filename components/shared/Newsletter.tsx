export default function Newsletter() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-orange-500/20 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 px-6 py-12 sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative max-w-xl">
          <span className="inline-block rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-400 ring-1 ring-orange-500/20">
            Newsletter
          </span>
          <h2 className="font-display mt-4 text-3xl text-white sm:text-4xl">
            Never miss a story
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
            Get a curated weekly digest of the best reads on TrendsMix — handpicked
            fiction delivered straight to your inbox.
          </p>

          <form className="mt-8 flex flex-col gap-3 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className="flex-1 rounded-xl border border-zinc-700/80 bg-zinc-950/80 px-4 py-3.5 text-sm text-white placeholder:text-zinc-500 backdrop-blur-sm transition-colors focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <button
              type="submit"
              className="rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:bg-orange-400 hover:shadow-orange-500/35"
            >
              Subscribe
            </button>
          </form>

          <p className="mt-4 text-xs text-zinc-500">
            Free forever. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
