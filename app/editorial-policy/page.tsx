import type { Metadata } from "next";
import Link from "next/link";
import LegalPageLayout from "@/components/layout/LegalPageLayout";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Editorial Policy",
  description:
    "The TrendsMix editorial policy outlines how we write, review, and publish stories and articles — our standards for quality, integrity, and reader trust.",
  path: "/editorial-policy",
});

export default function EditorialPolicyPage() {
  return (
    <LegalPageLayout title="Editorial Policy" lastUpdated="2026-11-23">
      <p>
        TrendsMix is built on a foundation of editorial integrity. This policy
        explains how we write, review, and publish our drama stories and
        lifestyle articles, and the standards we hold ourselves to. Our goal is
        to earn and keep reader trust.
      </p>

      <section aria-labelledby="editorial-mission">
        <h2 id="editorial-mission" className="text-xl font-semibold text-white">
          1. Editorial Mission
        </h2>
        <p className="mt-4">
          Our mission is to publish emotional drama stories and practical
          lifestyle reads that are original, easy to read, and worth the
          reader&apos;s time. Our drama stories are fiction inspired by
          everyday life: names, places and events are invented or changed, and
          they should not be read as news or factual reporting.
        </p>
      </section>

      <section aria-labelledby="editorial-selection">
        <h2 id="editorial-selection" className="text-xl font-semibold text-white">
          2. Selection Process
        </h2>
        <p className="mt-4">
          Before anything is published on TrendsMix, the TrendsMix team:
        </p>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>
            <strong className="text-zinc-200">Checks the topic.</strong>{" "}
            The piece must fit our categories and our content standards below.
          </li>
          <li>
            <strong className="text-zinc-200">Reviews the writing.</strong>{" "}
            We read it for originality, clarity, and value to the reader.
          </li>
          <li>
            <strong className="text-zinc-200">Edits it.</strong> We fix
            grammar, spelling and formatting.
          </li>
          <li>
            <strong className="text-zinc-200">Removes risky claims.</strong> We
            do not publish medical, legal or financial advice, or news-style
            claims about real people that we cannot source.
          </li>
        </ol>
      </section>

      <section aria-labelledby="editorial-standards">
        <h2 id="editorial-standards" className="text-xl font-semibold text-white">
          3. Content Standards
        </h2>
        <p className="mt-4">We do not publish content that:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Promotes hatred, discrimination, or violence against any individual or group.</li>
          <li>Contains gratuitous or exploitative depictions of minors.</li>
          <li>Is plagiarised or infringes on another author&apos;s copyright.</li>
          <li>Is produced entirely by artificial intelligence without meaningful human authorship and editorial oversight (see our{" "}
            <Link href="/ai-policy" className="text-orange-400 underline decoration-orange-400/30 underline-offset-2 transition-colors hover:text-orange-300">
              AI Content Policy
            </Link>{" "}
            for details).
          </li>
        </ul>
        <p className="mt-3">
          Stories may touch on mature themes such as family conflict, illness
          or loss when they serve the story, but never in a graphic or
          exploitative way. A category tag and reading-time estimate are shown
          on every story to help readers choose what to read.
        </p>
      </section>

      <section aria-labelledby="editorial-independence">
        <h2 id="editorial-independence" className="text-xl font-semibold text-white">
          4. Editorial Independence
        </h2>
        <p className="mt-4">
          Editorial decisions at TrendsMix are made solely on the basis of
          quality and reader value. We do not accept payment for publishing
          stories, and commercial considerations never influence editorial
          selection. If sponsored or promoted content is ever introduced, it will
          be clearly and prominently labelled.
        </p>
      </section>

      <section aria-labelledby="editorial-corrections">
        <h2 id="editorial-corrections" className="text-xl font-semibold text-white">
          5. Corrections &amp; Updates
        </h2>
        <p className="mt-4">
          We take accuracy seriously. If an error is identified in a published
          story or article — whether factual, typographical, or attributional —
          we will correct it promptly and note the correction where appropriate.
        </p>
        <p className="mt-3">
          To report an error, please use our{" "}
          <Link href="/contact" className="text-orange-400 underline decoration-orange-400/30 underline-offset-2 transition-colors hover:text-orange-300">
            Contact
          </Link>{" "}
          page and include the story title and a description of the issue.
        </p>
      </section>

      <section aria-labelledby="editorial-attribution">
        <h2 id="editorial-attribution" className="text-xl font-semibold text-white">
          6. Attribution &amp; Authorship
        </h2>
        <p className="mt-4">
          Stories are published under the TrendsMix byline unless a named author
          is credited on the story. When we publish work by an outside writer,
          we credit them by name and do not make substantive changes without
          their consent. Outside writers keep ownership of their original work
          unless a separate agreement states otherwise.
        </p>
      </section>

      <section aria-labelledby="editorial-copyright">
        <h2 id="editorial-copyright" className="text-xl font-semibold text-white">
          7. Copyright &amp; Plagiarism
        </h2>
        <p className="mt-4">
          TrendsMix has zero tolerance for plagiarism. All submissions are
          expected to be original work. If we discover that a published story
          infringes another author&apos;s copyright, it will be removed
          immediately. Copyright holders may file a notice under our{" "}
          <Link href="/dmca" className="text-orange-400 underline decoration-orange-400/30 underline-offset-2 transition-colors hover:text-orange-300">
            DMCA Policy
          </Link>
          .
        </p>
      </section>

      <section aria-labelledby="editorial-feedback">
        <h2 id="editorial-feedback" className="text-xl font-semibold text-white">
          8. Reader Feedback
        </h2>
        <p className="mt-4">
          We welcome feedback from our readers. If you have concerns about any
          content published on TrendsMix — including factual accuracy, content
          sensitivity, or editorial conduct — please{" "}
          <Link href="/contact" className="text-orange-400 underline decoration-orange-400/30 underline-offset-2 transition-colors hover:text-orange-300">
            contact us
          </Link>
          . We read and review every report.
        </p>
      </section>
    </LegalPageLayout>
  );
}
