import type { Metadata } from "next";
import Link from "next/link";
import LegalPageLayout from "@/components/layout/LegalPageLayout";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Disclaimer",
  description:
    "TrendsMix disclaimer covering the fictional nature of content, content advisories, external links, accuracy, and limitation of liability.",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <LegalPageLayout title="Disclaimer" lastUpdated="2026-07-09">
      <p>
        The information and content provided on TrendsMix is intended for
        entertainment purposes only. By accessing our Platform, you acknowledge
        and agree to the terms outlined in this Disclaimer.
      </p>

      <section aria-labelledby="disclaimer-fiction">
        <h2 id="disclaimer-fiction" className="text-xl font-semibold text-white">
          1. Fictional Content
        </h2>
        <p className="mt-4">
          All stories, narratives, and creative works published on TrendsMix are
          works of fiction. Names, characters, businesses, places, events, and
          incidents are either the products of the respective author&apos;s
          imagination or used in a purely fictitious manner. Any resemblance to
          actual persons — living or dead — actual events, or real locales is
          entirely coincidental.
        </p>
      </section>

      <section aria-labelledby="disclaimer-advisory">
        <h2 id="disclaimer-advisory" className="text-xl font-semibold text-white">
          2. Content Advisory
        </h2>
        <p className="mt-4">
          TrendsMix publishes fiction across multiple genres, including horror,
          mystery, and drama. Some stories may contain themes or depictions of:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Violence or physical threat.</li>
          <li>Psychological tension and disturbing imagery.</li>
          <li>Strong or coarse language.</li>
          <li>Mature emotional themes such as grief, loss, or trauma.</li>
        </ul>
        <p className="mt-3">
          Reader discretion is advised. Where possible, individual stories
          include genre labels and reading-time estimates to help you make
          informed choices about what to read.
        </p>
      </section>

      <section aria-labelledby="disclaimer-no-advice">
        <h2 id="disclaimer-no-advice" className="text-xl font-semibold text-white">
          3. No Professional Advice
        </h2>
        <p className="mt-4">
          Nothing published on TrendsMix constitutes legal, medical, financial,
          psychological, or other professional advice. The Platform is an
          entertainment and literary publication. If you require professional
          guidance, consult a qualified practitioner in the relevant field.
        </p>
      </section>

      <section aria-labelledby="disclaimer-accuracy">
        <h2 id="disclaimer-accuracy" className="text-xl font-semibold text-white">
          4. Accuracy &amp; Availability
        </h2>
        <p className="mt-4">
          While we make every reasonable effort to ensure the Platform operates
          reliably, TrendsMix is provided on an &quot;AS IS&quot; basis. We make
          no guarantees regarding:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>The accuracy, completeness, or timeliness of any Content.</li>
          <li>Uninterrupted or error-free access to the Platform.</li>
          <li>The absence of viruses or other harmful components.</li>
        </ul>
      </section>

      <section aria-labelledby="disclaimer-external-links">
        <h2 id="disclaimer-external-links" className="text-xl font-semibold text-white">
          5. External Links
        </h2>
        <p className="mt-4">
          TrendsMix may contain links to third-party websites or resources. These
          links are provided for convenience only. We do not endorse, control, or
          assume responsibility for the content, privacy practices, or
          availability of any external site. Visiting external links is at your
          own risk.
        </p>
      </section>

      <section aria-labelledby="disclaimer-liability">
        <h2 id="disclaimer-liability" className="text-xl font-semibold text-white">
          6. Limitation of Liability
        </h2>
        <p className="mt-4">
          To the fullest extent permitted by law, TrendsMix and its operators
          shall not be liable for any direct, indirect, incidental,
          consequential, or punitive damages arising from your use of (or
          inability to use) the Platform or its Content. This includes, without
          limitation, damages for loss of profits, data, or goodwill.
        </p>
        <p className="mt-3">
          For the complete terms governing your use of TrendsMix, please review
          our{" "}
          <Link href="/terms" className="text-orange-400 underline decoration-orange-400/30 underline-offset-2 transition-colors hover:text-orange-300">
            Terms of Service
          </Link>
          .
        </p>
      </section>

      <section aria-labelledby="disclaimer-ai">
        <h2 id="disclaimer-ai" className="text-xl font-semibold text-white">
          7. AI-Generated Content
        </h2>
        <p className="mt-4">
          Some content on TrendsMix may be created or assisted by artificial
          intelligence tools. All AI-generated or AI-assisted content undergoes
          editorial review before publication. For complete details, see our{" "}
          <Link href="/ai-policy" className="text-orange-400 underline decoration-orange-400/30 underline-offset-2 transition-colors hover:text-orange-300">
            AI Content Policy
          </Link>
          .
        </p>
      </section>

      <section aria-labelledby="disclaimer-changes">
        <h2 id="disclaimer-changes" className="text-xl font-semibold text-white">
          8. Changes to This Disclaimer
        </h2>
        <p className="mt-4">
          We may update this Disclaimer at any time. Changes take effect
          immediately upon posting. We encourage you to review this page
          periodically. Continued use of TrendsMix constitutes acceptance of the
          current version.
        </p>
      </section>

      <section aria-labelledby="disclaimer-contact">
        <h2 id="disclaimer-contact" className="text-xl font-semibold text-white">
          9. Questions
        </h2>
        <p className="mt-4">
          If you have questions about this Disclaimer, please reach out through
          our{" "}
          <Link href="/contact" className="text-orange-400 underline decoration-orange-400/30 underline-offset-2 transition-colors hover:text-orange-300">
            Contact
          </Link>{" "}
          page.
        </p>
      </section>
    </LegalPageLayout>
  );
}
