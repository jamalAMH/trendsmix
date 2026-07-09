import type { Metadata } from "next";
import Link from "next/link";
import LegalPageLayout from "@/components/layout/LegalPageLayout";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Terms of Service",
  description:
    "Review the TrendsMix terms of service governing your use of our platform, including intellectual property, user conduct, disclaimers, and limitation of liability.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="2026-07-09">
      <p>
        Welcome to TrendsMix. These Terms of Service (&quot;Terms&quot;) govern
        your access to and use of the TrendsMix website and all associated
        content, features, and services (collectively, the &quot;Platform&quot;).
        By accessing or using TrendsMix, you agree to be bound by these Terms. If
        you do not agree, please do not use the Platform.
      </p>

      <section aria-labelledby="terms-definitions">
        <h2 id="terms-definitions" className="text-xl font-semibold text-white">
          1. Definitions
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>
            <strong className="text-zinc-200">&quot;Content&quot;</strong> means
            all text, stories, images, graphics, metadata, and other materials
            published on the Platform.
          </li>
          <li>
            <strong className="text-zinc-200">&quot;User&quot;</strong> or{" "}
            <strong className="text-zinc-200">&quot;you&quot;</strong> means any
            individual who accesses or uses the Platform.
          </li>
          <li>
            <strong className="text-zinc-200">&quot;We,&quot; &quot;us,&quot;</strong>{" "}
            or <strong className="text-zinc-200">&quot;our&quot;</strong> refers
            to TrendsMix and its operators.
          </li>
        </ul>
      </section>

      <section aria-labelledby="terms-eligibility">
        <h2 id="terms-eligibility" className="text-xl font-semibold text-white">
          2. Eligibility
        </h2>
        <p className="mt-4">
          You must be at least 13 years of age to use TrendsMix. By using the
          Platform, you represent and warrant that you meet this requirement. If
          you are under 18, you confirm that you have the consent of a parent or
          legal guardian.
        </p>
      </section>

      <section aria-labelledby="terms-license">
        <h2 id="terms-license" className="text-xl font-semibold text-white">
          3. Licence to Use the Platform
        </h2>
        <p className="mt-4">
          We grant you a limited, non-exclusive, non-transferable, revocable
          licence to access and use TrendsMix for personal, non-commercial
          purposes, subject to these Terms.
        </p>
      </section>

      <section aria-labelledby="terms-ip">
        <h2 id="terms-ip" className="text-xl font-semibold text-white">
          4. Intellectual Property
        </h2>
        <p className="mt-4">
          All Content on TrendsMix — including stories, artwork, design elements,
          logos, and trademarks — is owned by TrendsMix or its licensors and is
          protected by international copyright and intellectual property laws.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>You may read Content for personal enjoyment.</li>
          <li>
            You may share links to stories, provided you do not reproduce the
            Content itself without written permission.
          </li>
          <li>
            You may not copy, distribute, modify, create derivative works from,
            publicly display, or commercially exploit any Content without prior
            written consent.
          </li>
        </ul>
        <p className="mt-3">
          If you believe your copyrighted work has been used without
          authorisation, see our{" "}
          <Link href="/dmca" className="text-orange-400 underline decoration-orange-400/30 underline-offset-2 transition-colors hover:text-orange-300">
            DMCA Policy
          </Link>
          .
        </p>
      </section>

      <section aria-labelledby="terms-conduct">
        <h2 id="terms-conduct" className="text-xl font-semibold text-white">
          5. User Conduct
        </h2>
        <p className="mt-4">When using TrendsMix, you agree not to:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Violate any applicable law or regulation.</li>
          <li>
            Attempt to gain unauthorised access to any part of the Platform, its
            servers, or connected systems.
          </li>
          <li>
            Use automated tools (bots, scrapers, crawlers) to access or harvest
            Content beyond what is permitted by our{" "}
            <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-300">
              robots.txt
            </code>
            .
          </li>
          <li>
            Interfere with or disrupt the integrity or performance of the
            Platform.
          </li>
          <li>
            Reproduce, republish, or redistribute Content for commercial
            purposes.
          </li>
          <li>
            Impersonate any person or entity or misrepresent your affiliation
            with any person or entity.
          </li>
        </ul>
      </section>

      <section aria-labelledby="terms-submissions">
        <h2 id="terms-submissions" className="text-xl font-semibold text-white">
          6. User Submissions
        </h2>
        <p className="mt-4">
          If you submit content to TrendsMix — including story submissions,
          feedback, or correspondence — you grant us a non-exclusive, worldwide,
          royalty-free licence to use, reproduce, modify, and display that
          submission in connection with operating the Platform. You retain
          ownership of your original work.
        </p>
      </section>

      <section aria-labelledby="terms-disclaimers">
        <h2 id="terms-disclaimers" className="text-xl font-semibold text-white">
          7. Disclaimers
        </h2>
        <p className="mt-4">
          The Platform and all Content are provided on an &quot;AS IS&quot; and
          &quot;AS AVAILABLE&quot; basis without warranties of any kind, either
          express or implied, including but not limited to warranties of
          merchantability, fitness for a particular purpose, or
          non-infringement.
        </p>
        <p className="mt-3">
          All stories published on TrendsMix are works of fiction. For full
          details, see our{" "}
          <Link href="/disclaimer" className="text-orange-400 underline decoration-orange-400/30 underline-offset-2 transition-colors hover:text-orange-300">
            Disclaimer
          </Link>
          .
        </p>
      </section>

      <section aria-labelledby="terms-liability">
        <h2 id="terms-liability" className="text-xl font-semibold text-white">
          8. Limitation of Liability
        </h2>
        <p className="mt-4">
          To the maximum extent permitted by applicable law, TrendsMix and its
          operators, employees, and affiliates shall not be liable for any
          indirect, incidental, special, consequential, or punitive damages
          arising out of or related to your use of the Platform, including but
          not limited to loss of profits, data, or goodwill.
        </p>
      </section>

      <section aria-labelledby="terms-indemnification">
        <h2 id="terms-indemnification" className="text-xl font-semibold text-white">
          9. Indemnification
        </h2>
        <p className="mt-4">
          You agree to indemnify, defend, and hold harmless TrendsMix and its
          operators from any claims, liabilities, damages, losses, or expenses
          (including reasonable legal fees) arising out of your use of the
          Platform or violation of these Terms.
        </p>
      </section>

      <section aria-labelledby="terms-termination">
        <h2 id="terms-termination" className="text-xl font-semibold text-white">
          10. Termination
        </h2>
        <p className="mt-4">
          We reserve the right to suspend or terminate your access to TrendsMix
          at any time, for any reason, without prior notice. Upon termination,
          your licence to use the Platform is immediately revoked.
        </p>
      </section>

      <section aria-labelledby="terms-third-party">
        <h2 id="terms-third-party" className="text-xl font-semibold text-white">
          11. Third-Party Links
        </h2>
        <p className="mt-4">
          TrendsMix may contain links to third-party websites. We do not endorse
          or assume responsibility for the content, privacy policies, or
          practices of any third-party site. You access external links at your
          own risk.
        </p>
      </section>

      <section aria-labelledby="terms-changes">
        <h2 id="terms-changes" className="text-xl font-semibold text-white">
          12. Changes to These Terms
        </h2>
        <p className="mt-4">
          We may revise these Terms at any time by updating this page. The
          &quot;Last updated&quot; date at the top indicates when the most recent
          changes were made. Your continued use of TrendsMix after any
          modification constitutes acceptance of the updated Terms.
        </p>
      </section>

      <section aria-labelledby="terms-governing-law">
        <h2 id="terms-governing-law" className="text-xl font-semibold text-white">
          13. Governing Law
        </h2>
        <p className="mt-4">
          These Terms shall be governed by and construed in accordance with the
          laws of the jurisdiction in which TrendsMix operates, without regard to
          its conflict of law provisions.
        </p>
      </section>

      <section aria-labelledby="terms-contact">
        <h2 id="terms-contact" className="text-xl font-semibold text-white">
          14. Contact
        </h2>
        <p className="mt-4">
          If you have any questions about these Terms, please{" "}
          <Link href="/contact" className="text-orange-400 underline decoration-orange-400/30 underline-offset-2 transition-colors hover:text-orange-300">
            contact us
          </Link>
          .
        </p>
      </section>
    </LegalPageLayout>
  );
}
