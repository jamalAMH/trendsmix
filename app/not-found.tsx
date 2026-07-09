import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Page Not Found",
  description:
    "The page you are looking for could not be found on TrendsMix.",
  path: "/404",
  noIndex: true,
});

export default function NotFound() {
  return (
    <section
      aria-labelledby="not-found-heading"
      className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8"
    >
      <p className="text-sm font-semibold uppercase tracking-wider text-orange-400">
        404
      </p>
      <h1
        id="not-found-heading"
        className="mt-4 text-3xl font-bold text-white sm:text-4xl"
      >
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-base text-zinc-400">
        The page you&apos;re looking for doesn&apos;t exist or may have been
        moved. Head back home and keep reading.
      </p>
      <nav aria-label="Helpful links" className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-xl bg-orange-500 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
        >
          Back to Home
        </Link>
        <Link
          href="/stories"
          className="rounded-xl border border-zinc-700 px-8 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
        >
          Browse Stories
        </Link>
      </nav>
    </section>
  );
}
