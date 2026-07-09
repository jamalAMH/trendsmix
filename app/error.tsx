"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section
      aria-labelledby="error-heading"
      className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8"
    >
      <p className="text-sm font-semibold uppercase tracking-wider text-orange-400">
        Error
      </p>
      <h1
        id="error-heading"
        className="mt-4 text-3xl font-bold text-white sm:text-4xl"
      >
        Something went wrong
      </h1>
      <p className="mt-4 max-w-md text-base text-zinc-400">
        We hit an unexpected issue loading this page. You can try again or return
        to browsing stories.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-orange-500 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-xl border border-zinc-700 px-8 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}
