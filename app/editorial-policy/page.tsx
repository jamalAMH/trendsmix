import type { Metadata } from "next";
import Link from "next/link";
import LegalPageLayout from "@/components/layout/LegalPageLayout";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Editorial Policy",
  description:
    "The TrendsMix editorial policy outlines how we select, review, and publish original fiction — our standards for quality, integrity, and reader trust.",
  path: "/editorial-policy",
});

export default function EditorialPolicyPage() {
  return (
    <LegalPageLayout title="Editorial Policy" lastUpdated="2026-07-09">
      <p>
        TrendsMix is built on a foundation of editorial integrity. This policy
        explains how we select, review, and publish original fiction, and the
        standards we hold ourselves to. Our goal is to maintain reader trust
        while fostering a platform where compelling, original storytelling
        thrives.
      </p>

      <section aria-labelledby="editorial-mission">
        <h2 id="editorial-mission" className="text-xl font-semibold text-white">
          1. Editorial Mission
        </h2>
        <p className="mt-4">
          Our editorial mission is to publish short fiction that is original,
          engaging, and diverse in voice and genre. We prioritise narratives that
          demonstrate craft, emotional resonance, and a distinct point of view —
          regardless of the author&apos;s background or publishing history.
        </p>
      </section>

      <section aria-labelledby="editorial-selection">
        <h2 id="editorial-selection" className="text-xl font-semibold text-white">
          2. Selection Process
        </h2>
        <p className="mt-4">
          Every story published on TrendsMix passes through a structured
          editorial pipeline:
        </p>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>
            <strong className="text-zinc-200">Initial screening.</strong>{" "}
            Submissions are reviewed for adherence to our genre scope, word
            count guidelines, and content standards.
          </li>
          <li>
            <strong className="text-zinc-200">Editorial evaluation.</strong>{" "}
            Stories that pass screening are assessed for narrative quality,
            originality, pacing, and emotional impact.
          </li>
          <li>
            <strong className="text-zinc-200">Copy editing.</strong> Accepted
            stories undergo copy editing for grammar, consistency, and clarity
            while preserving the author&apos;s voice.
          </li>
          <li>
            <strong className="text-zinc-200">Final review.</strong> A senior
            editor conducts a final review before publication to ensure the
            piece meets our quality benchmarks.
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
          Stories containing mature themes (violence, horror elements, strong
          language) are permitted when they serve the narrative and are
          appropriately labelled. Genre tags and reading-time estimates are
          displayed on every story to help readers make informed choices.
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
          Every story on TrendsMix is attributed to its author by name. We
          respect authorial voice and do not make substantive changes to a
          story&apos;s content without the author&apos;s consent. Authors retain
          ownership of their original work unless a separate agreement states
          otherwise.
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
          . Every report is reviewed by a member of our editorial team.
        </p>
      </section>
    </LegalPageLayout>
  );
}
