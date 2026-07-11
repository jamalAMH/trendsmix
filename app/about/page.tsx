import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description:
    "TrendsMix is a premium digital fiction platform publishing original short stories across horror, mystery, romance, fantasy, sci-fi, and drama — fresh reads every day.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-medium text-orange-400">{SITE_NAME}</p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
          About TrendsMix
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-300">
          A premium destination for original fiction — curated reads across every
          genre, designed for readers who crave something unforgettable.
        </p>
      </header>

      <div className="mt-10 space-y-10 text-base leading-relaxed text-zinc-400">
        <section aria-labelledby="about-mission">
          <h2
            id="about-mission"
            className="text-xl font-semibold text-white"
          >
            Our Mission
          </h2>
          <p className="mt-4">
            TrendsMix exists to champion short fiction in the digital age. We
            believe powerful stories should be free, accessible, and easy to
            discover — whether you have five minutes during a commute or an
            entire evening to yourself.
          </p>
          <p className="mt-3">
            Every story we publish is selected with care. We prioritize voice,
            originality, and emotional impact over word count. The result is a
            library of fiction that rewards attention and stays with you long
            after the last line.
          </p>
        </section>

        <section aria-labelledby="about-what-we-publish">
          <h2
            id="about-what-we-publish"
            className="text-xl font-semibold text-white"
          >
            What We Publish
          </h2>
          <p className="mt-4">
            We publish gripping, emotionally charged stories that keep readers
            hooked from the first line to the last. Our focus is on dramatic
            fiction — real-life inspired narratives full of twists, betrayals,
            resilience, and redemption.
          </p>
          <ul className="mt-4 space-y-2">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" aria-hidden="true" />
              <span><strong className="text-zinc-200">Drama</strong> — Intense family conflicts, shocking revelations, and powerful comebacks.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" aria-hidden="true" />
              <span><strong className="text-zinc-200">Revenge &amp; Justice</strong> — Stories where the underdog fights back and wins against all odds.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" aria-hidden="true" />
              <span><strong className="text-zinc-200">Relationships</strong> — Marriage, betrayal, trust, and the raw emotions that define us.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" aria-hidden="true" />
              <span><strong className="text-zinc-200">Life Stories</strong> — Extraordinary tales of ordinary people facing impossible situations.</span>
            </li>
          </ul>
        </section>

        <section aria-labelledby="about-readers">
          <h2
            id="about-readers"
            className="text-xl font-semibold text-white"
          >
            Built for Readers
          </h2>
          <p className="mt-4">
            TrendsMix is designed reading-first. Every element of the platform —
            from typography and spacing to progress tracking and navigation — is
            crafted to deliver a premium reading experience that feels
            distraction-free, whether you are on a phone, tablet, or desktop.
          </p>
          <p className="mt-3">
            We never gate content behind paywalls, and we never interrupt a
            story with advertising. Reading on TrendsMix is, and will remain,
            free.
          </p>
        </section>

        <section aria-labelledby="about-editorial">
          <h2
            id="about-editorial"
            className="text-xl font-semibold text-white"
          >
            Editorial Standards
          </h2>
          <p className="mt-4">
            Quality is non-negotiable. Every submission passes through a
            multi-stage editorial review before publication. We evaluate
            narrative craft, originality, and emotional resonance — not
            algorithmic trends.
          </p>
          <p className="mt-3">
            For full details on how we select, review, and maintain the integrity
            of our catalogue, see our{" "}
            <Link
              href="/editorial-policy"
              className="text-orange-400 underline decoration-orange-400/30 underline-offset-2 transition-colors hover:text-orange-300"
            >
              Editorial Policy
            </Link>
            .
          </p>
        </section>

        <section aria-labelledby="about-roadmap">
          <h2
            id="about-roadmap"
            className="text-xl font-semibold text-white"
          >
            What&apos;s Next
          </h2>
          <p className="mt-4">
            TrendsMix is in active development. In upcoming releases we plan to
            introduce advanced search, personalized recommendations, author
            profiles, reader accounts, and a weekly newsletter. We are building
            in public and welcome feedback at every stage.
          </p>
        </section>

        <section aria-labelledby="about-contact">
          <h2
            id="about-contact"
            className="text-xl font-semibold text-white"
          >
            Get in Touch
          </h2>
          <p className="mt-4">
            Have a question, partnership idea, or story submission? Visit our{" "}
            <Link
              href="/contact"
              className="text-orange-400 underline decoration-orange-400/30 underline-offset-2 transition-colors hover:text-orange-300"
            >
              Contact
            </Link>{" "}
            page — we read every message and respond as quickly as possible.
          </p>
        </section>
      </div>
    </article>
  );
}
