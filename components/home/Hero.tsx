import Link from "next/link";
import type { Story } from "@/types/story";
import FeaturedStory from "@/components/home/FeaturedStory";

interface HeroProps {
  featuredStory: Story;
}

export default function Hero({ featuredStory }: HeroProps) {
  return (
    <section className="gradient-mesh relative overflow-hidden border-b border-zinc-800/50">
      <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-amber-500/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-orange-400">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
              New stories every day
            </span>

            <h1 className="font-display mt-6 text-4xl leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Stories worth losing sleep over.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-zinc-400 sm:text-lg">
              TrendsMix is your daily magazine for original fiction — curated
              reads across every genre, designed for readers who crave something
              unforgettable.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/stories"
                className="inline-flex items-center rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:bg-orange-400 hover:shadow-orange-500/35"
              >
                Explore Stories
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center rounded-xl border border-zinc-700 bg-zinc-900/50 px-6 py-3.5 text-sm font-semibold text-zinc-300 transition-all hover:border-zinc-600 hover:text-white"
              >
                About TrendsMix
              </Link>
            </div>

            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-zinc-800/80 pt-8">
              <div>
                <dt className="text-xs uppercase tracking-wider text-zinc-500">
                  Genres
                </dt>
                <dd className="mt-1 text-xl font-semibold text-white">6+</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-zinc-500">
                  Daily reads
                </dt>
                <dd className="mt-1 text-xl font-semibold text-white">Fresh</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-zinc-500">
                  Avg. read
                </dt>
                <dd className="mt-1 text-xl font-semibold text-white">8 min</dd>
              </div>
            </dl>
          </div>

          <div className="animate-fade-up lg:pl-4" style={{ animationDelay: "0.15s" }}>
            <FeaturedStory story={featuredStory} />
          </div>
        </div>
      </div>
    </section>
  );
}
