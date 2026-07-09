import type { Metadata } from "next";
import Link from "next/link";
import LegalPageLayout from "@/components/layout/LegalPageLayout";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "The TrendsMix privacy policy explains what personal information we collect, how we use it, your rights, and how to contact us about data protection.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="2026-07-09">
      <p>
        TrendsMix (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is
        committed to protecting the privacy of every visitor. This Privacy Policy
        explains what information we collect when you use our website, how we use
        and safeguard that information, and what choices you have. By accessing
        or using TrendsMix, you agree to the practices described below.
      </p>

      <section aria-labelledby="privacy-info-collect">
        <h2 id="privacy-info-collect" className="text-xl font-semibold text-white">
          1. Information We Collect
        </h2>

        <h3 className="mt-5 text-base font-semibold text-zinc-200">
          1.1 Information You Provide Directly
        </h3>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            <strong className="text-zinc-200">Contact form submissions.</strong>{" "}
            When you use our{" "}
            <Link href="/contact" className="text-orange-400 underline decoration-orange-400/30 underline-offset-2 transition-colors hover:text-orange-300">
              Contact
            </Link>{" "}
            page, we collect your name, email address, and message content.
          </li>
          <li>
            <strong className="text-zinc-200">Newsletter subscriptions.</strong>{" "}
            If you subscribe to our newsletter, we collect the email address you
            provide.
          </li>
        </ul>

        <h3 className="mt-5 text-base font-semibold text-zinc-200">
          1.2 Information Collected Automatically
        </h3>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            <strong className="text-zinc-200">Log data.</strong> Our servers
            automatically record your IP address, browser type, operating system,
            referring URL, pages visited, and timestamps.
          </li>
          <li>
            <strong className="text-zinc-200">Cookies &amp; similar technologies.</strong>{" "}
            We use cookies and local storage to improve site functionality and
            remember your preferences. For full details, see our{" "}
            <Link href="/cookies" className="text-orange-400 underline decoration-orange-400/30 underline-offset-2 transition-colors hover:text-orange-300">
              Cookie Policy
            </Link>
            .
          </li>
          <li>
            <strong className="text-zinc-200">Analytics.</strong> We may use
            third-party analytics services (such as Google Analytics) that collect
            anonymous usage data to help us understand how visitors interact with
            the site.
          </li>
        </ul>
      </section>

      <section aria-labelledby="privacy-how-use">
        <h2 id="privacy-how-use" className="text-xl font-semibold text-white">
          2. How We Use Your Information
        </h2>
        <p className="mt-4">We use collected information to:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Operate, maintain, and improve the TrendsMix platform.</li>
          <li>Respond to enquiries and support requests.</li>
          <li>Deliver newsletter content you have opted into.</li>
          <li>Analyse usage trends to enhance user experience.</li>
          <li>Detect, prevent, and address technical issues or abuse.</li>
          <li>Comply with legal obligations.</li>
        </ul>
      </section>

      <section aria-labelledby="privacy-sharing">
        <h2 id="privacy-sharing" className="text-xl font-semibold text-white">
          3. Information Sharing &amp; Disclosure
        </h2>
        <p className="mt-4">
          We do not sell, rent, or trade your personal information. We may share
          data only in the following limited circumstances:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            <strong className="text-zinc-200">Service providers.</strong> Trusted
            third parties that help us operate the site (hosting, analytics, email
            delivery) may process data on our behalf under strict confidentiality
            agreements.
          </li>
          <li>
            <strong className="text-zinc-200">Legal requirements.</strong> We may
            disclose information if required by law, regulation, or valid legal
            process.
          </li>
          <li>
            <strong className="text-zinc-200">Business transfers.</strong> In the
            event of a merger, acquisition, or sale of assets, your data may be
            transferred as part of that transaction.
          </li>
        </ul>
      </section>

      <section aria-labelledby="privacy-retention">
        <h2 id="privacy-retention" className="text-xl font-semibold text-white">
          4. Data Retention
        </h2>
        <p className="mt-4">
          We retain personal information only for as long as necessary to fulfil
          the purposes outlined in this policy. Contact form data is retained for
          up to 12 months. Analytics data is retained in aggregated,
          non-identifiable form.
        </p>
      </section>

      <section aria-labelledby="privacy-security">
        <h2 id="privacy-security" className="text-xl font-semibold text-white">
          5. Data Security
        </h2>
        <p className="mt-4">
          We implement industry-standard technical and organisational measures to
          protect your data against unauthorised access, alteration, or
          destruction. These include HTTPS encryption, secure hosting
          infrastructure, and regular security audits. However, no method of
          electronic transmission or storage is 100% secure, and we cannot
          guarantee absolute security.
        </p>
      </section>

      <section aria-labelledby="privacy-rights">
        <h2 id="privacy-rights" className="text-xl font-semibold text-white">
          6. Your Rights
        </h2>
        <p className="mt-4">
          Depending on your jurisdiction, you may have the right to:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Access the personal data we hold about you.</li>
          <li>Request correction of inaccurate data.</li>
          <li>Request deletion of your personal data.</li>
          <li>Object to or restrict certain processing activities.</li>
          <li>Withdraw consent at any time where processing is consent-based.</li>
          <li>Lodge a complaint with your local data protection authority.</li>
        </ul>
        <p className="mt-3">
          To exercise any of these rights, please{" "}
          <Link href="/contact" className="text-orange-400 underline decoration-orange-400/30 underline-offset-2 transition-colors hover:text-orange-300">
            contact us
          </Link>
          .
        </p>
      </section>

      <section aria-labelledby="privacy-children">
        <h2 id="privacy-children" className="text-xl font-semibold text-white">
          7. Children&apos;s Privacy
        </h2>
        <p className="mt-4">
          TrendsMix is not directed at individuals under the age of 13. We do
          not knowingly collect personal information from children. If you
          believe a child has provided us with personal data, please{" "}
          <Link href="/contact" className="text-orange-400 underline decoration-orange-400/30 underline-offset-2 transition-colors hover:text-orange-300">
            contact us
          </Link>{" "}
          and we will promptly delete it.
        </p>
      </section>

      <section aria-labelledby="privacy-third-party">
        <h2 id="privacy-third-party" className="text-xl font-semibold text-white">
          8. Third-Party Links
        </h2>
        <p className="mt-4">
          Our website may contain links to external sites not operated by us. We
          have no control over the content or privacy practices of those sites
          and accept no responsibility for them. We encourage you to review the
          privacy policy of every site you visit.
        </p>
      </section>

      <section aria-labelledby="privacy-changes">
        <h2 id="privacy-changes" className="text-xl font-semibold text-white">
          9. Changes to This Policy
        </h2>
        <p className="mt-4">
          We may update this Privacy Policy from time to time. When we do, we
          will revise the &quot;Last updated&quot; date at the top of this page.
          We encourage you to review this policy periodically. Continued use of
          TrendsMix after changes constitutes acceptance of the revised policy.
        </p>
      </section>

      <section aria-labelledby="privacy-contact">
        <h2 id="privacy-contact" className="text-xl font-semibold text-white">
          10. Contact Us
        </h2>
        <p className="mt-4">
          If you have questions or concerns about this Privacy Policy or our data
          practices, please reach out via our{" "}
          <Link href="/contact" className="text-orange-400 underline decoration-orange-400/30 underline-offset-2 transition-colors hover:text-orange-300">
            Contact
          </Link>{" "}
          page.
        </p>
      </section>
    </LegalPageLayout>
  );
}
