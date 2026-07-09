import type { Metadata } from "next";
import Link from "next/link";
import LegalPageLayout from "@/components/layout/LegalPageLayout";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "DMCA Policy",
  description:
    "TrendsMix DMCA policy outlining the procedure for reporting copyright infringement, filing takedown notices, and submitting counter-notifications.",
  path: "/dmca",
});

export default function DmcaPolicyPage() {
  return (
    <LegalPageLayout title="DMCA Policy" lastUpdated="2026-07-09">
      <p>
        TrendsMix respects the intellectual property rights of others and expects
        our users to do the same. In accordance with the Digital Millennium
        Copyright Act of 1998 (&quot;DMCA&quot;), we will respond promptly to
        claims of copyright infringement that are reported to our designated
        agent.
      </p>

      <section aria-labelledby="dmca-reporting">
        <h2 id="dmca-reporting" className="text-xl font-semibold text-white">
          1. Reporting Copyright Infringement
        </h2>
        <p className="mt-4">
          If you believe that content hosted on TrendsMix infringes your
          copyright, you may submit a written notification to our designated DMCA
          agent. To be effective, your notification must include the following
          information:
        </p>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>
            <strong className="text-zinc-200">Identification of the copyrighted work.</strong>{" "}
            A description of the copyrighted work you claim has been infringed,
            or, if multiple works are covered by a single notification, a
            representative list.
          </li>
          <li>
            <strong className="text-zinc-200">Identification of the infringing material.</strong>{" "}
            A description of the material you claim is infringing, including the
            specific URL(s) or other information sufficient for us to locate the
            material on our platform.
          </li>
          <li>
            <strong className="text-zinc-200">Your contact information.</strong>{" "}
            Your full legal name, mailing address, telephone number, and email
            address.
          </li>
          <li>
            <strong className="text-zinc-200">Good faith statement.</strong> A
            statement that you have a good faith belief that the use of the
            material is not authorised by the copyright owner, its agent, or the
            law.
          </li>
          <li>
            <strong className="text-zinc-200">Accuracy statement.</strong> A
            statement, made under penalty of perjury, that the information in the
            notification is accurate and that you are the copyright owner or
            authorised to act on behalf of the owner.
          </li>
          <li>
            <strong className="text-zinc-200">Signature.</strong> A physical or
            electronic signature of the copyright owner or an authorised
            representative.
          </li>
        </ol>
      </section>

      <section aria-labelledby="dmca-submit">
        <h2 id="dmca-submit" className="text-xl font-semibold text-white">
          2. How to Submit a Notice
        </h2>
        <p className="mt-4">
          DMCA takedown notices should be sent to our designated agent via our{" "}
          <Link href="/contact" className="text-orange-400 underline decoration-orange-400/30 underline-offset-2 transition-colors hover:text-orange-300">
            Contact
          </Link>{" "}
          page. Please select &quot;DMCA / Copyright&quot; as the subject to
          ensure your notice is routed to the appropriate team. We aim to
          acknowledge all DMCA notices within two business days.
        </p>
      </section>

      <section aria-labelledby="dmca-process">
        <h2 id="dmca-process" className="text-xl font-semibold text-white">
          3. Our Response Process
        </h2>
        <p className="mt-4">Upon receiving a valid DMCA notice, we will:</p>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>Remove or disable access to the allegedly infringing material promptly.</li>
          <li>Notify the content provider (if applicable) that the material has been removed.</li>
          <li>Provide the content provider with a copy of the takedown notice and information about filing a counter-notification.</li>
        </ol>
      </section>

      <section aria-labelledby="dmca-counter">
        <h2 id="dmca-counter" className="text-xl font-semibold text-white">
          4. Counter-Notification
        </h2>
        <p className="mt-4">
          If you believe that material was removed or disabled as a result of
          mistake or misidentification, you may submit a written
          counter-notification to our designated agent. Your counter-notification
          must include:
        </p>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>
            <strong className="text-zinc-200">Identification of the material.</strong>{" "}
            A description of the material that was removed and the location
            (URL) where it appeared before removal.
          </li>
          <li>
            <strong className="text-zinc-200">Good faith statement.</strong> A
            statement under penalty of perjury that you have a good faith belief
            the material was removed or disabled as a result of mistake or
            misidentification.
          </li>
          <li>
            <strong className="text-zinc-200">Consent to jurisdiction.</strong>{" "}
            A statement consenting to the jurisdiction of the federal district
            court for the judicial district in which your address is located, or,
            if your address is outside the United States, any judicial district
            in which TrendsMix may be found.
          </li>
          <li>
            <strong className="text-zinc-200">Your contact information.</strong>{" "}
            Your full legal name, mailing address, telephone number, and email
            address.
          </li>
          <li>
            <strong className="text-zinc-200">Signature.</strong> A physical or
            electronic signature.
          </li>
        </ol>
        <p className="mt-3">
          Upon receiving a valid counter-notification, we will forward it to the
          original complainant and, unless the complainant files a court action
          within 10–14 business days, we will restore the removed material.
        </p>
      </section>

      <section aria-labelledby="dmca-repeat">
        <h2 id="dmca-repeat" className="text-xl font-semibold text-white">
          5. Repeat Infringers
        </h2>
        <p className="mt-4">
          In accordance with the DMCA, TrendsMix maintains a policy of
          terminating, in appropriate circumstances, the accounts and access
          privileges of users who are determined to be repeat infringers.
        </p>
      </section>

      <section aria-labelledby="dmca-misrep">
        <h2 id="dmca-misrep" className="text-xl font-semibold text-white">
          6. Misrepresentation Warning
        </h2>
        <p className="mt-4">
          Under the DMCA, any person who knowingly materially misrepresents that
          material is infringing, or that material was removed or disabled by
          mistake, may be subject to liability for damages, including costs and
          attorney&apos;s fees. Please ensure your claims are accurate before
          filing a notice or counter-notification.
        </p>
      </section>

      <section aria-labelledby="dmca-contact">
        <h2 id="dmca-contact" className="text-xl font-semibold text-white">
          7. Contact
        </h2>
        <p className="mt-4">
          For all DMCA-related enquiries, please use our{" "}
          <Link href="/contact" className="text-orange-400 underline decoration-orange-400/30 underline-offset-2 transition-colors hover:text-orange-300">
            Contact
          </Link>{" "}
          page and select &quot;DMCA / Copyright&quot; as the subject. For
          general copyright and intellectual property questions, see our{" "}
          <Link href="/terms" className="text-orange-400 underline decoration-orange-400/30 underline-offset-2 transition-colors hover:text-orange-300">
            Terms of Service
          </Link>
          .
        </p>
      </section>
    </LegalPageLayout>
  );
}
