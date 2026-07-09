import type { Metadata } from "next";
import Link from "next/link";
import LegalPageLayout from "@/components/layout/LegalPageLayout";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Cookie Policy",
  description:
    "Learn how TrendsMix uses cookies and similar tracking technologies, what types of cookies we use, and how to manage your cookie preferences.",
  path: "/cookies",
});

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout title="Cookie Policy" lastUpdated="2026-07-09">
      <p>
        This Cookie Policy explains how TrendsMix (&quot;we,&quot;
        &quot;us,&quot; or &quot;our&quot;) uses cookies and similar
        technologies when you visit our website. It should be read alongside our{" "}
        <Link href="/privacy" className="text-orange-400 underline decoration-orange-400/30 underline-offset-2 transition-colors hover:text-orange-300">
          Privacy Policy
        </Link>
        , which provides further details on how we handle personal data.
      </p>

      <section aria-labelledby="cookies-what-are">
        <h2 id="cookies-what-are" className="text-xl font-semibold text-white">
          1. What Are Cookies?
        </h2>
        <p className="mt-4">
          Cookies are small text files that a website places on your device
          (computer, smartphone, or tablet) when you visit. They are widely used
          to make websites work more efficiently, provide reporting information,
          and assist with personalisation.
        </p>
        <p className="mt-3">
          Similar technologies include local storage, session storage, and pixel
          tags. This policy covers all such technologies collectively referred to
          as &quot;cookies.&quot;
        </p>
      </section>

      <section aria-labelledby="cookies-types">
        <h2 id="cookies-types" className="text-xl font-semibold text-white">
          2. Types of Cookies We Use
        </h2>

        <h3 className="mt-5 text-base font-semibold text-zinc-200">
          2.1 Strictly Necessary Cookies
        </h3>
        <p className="mt-3">
          These cookies are essential for the website to function correctly. They
          enable core features such as page navigation, secure areas, and
          accessibility preferences. You cannot opt out of these cookies because
          the site cannot operate properly without them.
        </p>

        <h3 className="mt-5 text-base font-semibold text-zinc-200">
          2.2 Performance &amp; Analytics Cookies
        </h3>
        <p className="mt-3">
          These cookies collect anonymous information about how visitors use our
          website — for example, which pages are visited most often and whether
          users encounter error messages. We use this data to improve site
          performance and user experience. Analytics data is aggregated and does
          not personally identify you.
        </p>

        <h3 className="mt-5 text-base font-semibold text-zinc-200">
          2.3 Functionality Cookies
        </h3>
        <p className="mt-3">
          These cookies remember choices you make (such as your preferred reading
          mode or previously dismissed notices) to provide a more personalised
          experience. The information they collect is anonymised and cannot track
          browsing activity on other websites.
        </p>
      </section>

      <section aria-labelledby="cookies-third-party">
        <h2 id="cookies-third-party" className="text-xl font-semibold text-white">
          3. Third-Party Cookies
        </h2>
        <p className="mt-4">
          We may use third-party services — such as analytics providers — that
          set their own cookies on your device. We do not control these cookies.
          The third-party provider&apos;s own privacy and cookie policies govern
          their use. Current third-party services we may use include:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            <strong className="text-zinc-200">Google Analytics</strong> — to
            understand traffic patterns and user behaviour in aggregate.
          </li>
          <li>
            <strong className="text-zinc-200">Hosting provider analytics</strong>{" "}
            — server-level performance metrics provided by our hosting
            infrastructure.
          </li>
        </ul>
      </section>

      <section aria-labelledby="cookies-manage">
        <h2 id="cookies-manage" className="text-xl font-semibold text-white">
          4. How to Manage Cookies
        </h2>
        <p className="mt-4">
          Most web browsers allow you to control cookies through their settings.
          You can typically:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>View what cookies are stored on your device.</li>
          <li>Delete individual cookies or clear all cookies.</li>
          <li>Block all cookies or only third-party cookies.</li>
          <li>
            Configure your browser to notify you when a cookie is being set.
          </li>
        </ul>
        <p className="mt-3">
          Please note that blocking or deleting cookies may affect the
          functionality of TrendsMix and other websites. Strictly necessary
          cookies cannot be disabled without impairing core site features.
        </p>
        <p className="mt-3">
          For instructions specific to your browser, consult its help
          documentation or visit{" "}
          <a
            href="https://www.allaboutcookies.org/manage-cookies/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-400 underline decoration-orange-400/30 underline-offset-2 transition-colors hover:text-orange-300"
          >
            allaboutcookies.org
          </a>
          .
        </p>
      </section>

      <section aria-labelledby="cookies-retention">
        <h2 id="cookies-retention" className="text-xl font-semibold text-white">
          5. Cookie Retention Periods
        </h2>
        <p className="mt-4">
          Cookies set by TrendsMix have varying lifespans depending on their
          purpose:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            <strong className="text-zinc-200">Session cookies</strong> — deleted
            automatically when you close your browser.
          </li>
          <li>
            <strong className="text-zinc-200">Persistent cookies</strong> —
            remain on your device for a set period (typically 30 days to 12
            months) or until you delete them manually.
          </li>
        </ul>
      </section>

      <section aria-labelledby="cookies-changes">
        <h2 id="cookies-changes" className="text-xl font-semibold text-white">
          6. Changes to This Policy
        </h2>
        <p className="mt-4">
          We may update this Cookie Policy from time to time to reflect changes
          in technology, legislation, or our operating practices. When we do, we
          will revise the &quot;Last updated&quot; date at the top of this page.
          We encourage you to check this page periodically.
        </p>
      </section>

      <section aria-labelledby="cookies-contact">
        <h2 id="cookies-contact" className="text-xl font-semibold text-white">
          7. Contact Us
        </h2>
        <p className="mt-4">
          If you have questions about our use of cookies, please get in touch
          through our{" "}
          <Link href="/contact" className="text-orange-400 underline decoration-orange-400/30 underline-offset-2 transition-colors hover:text-orange-300">
            Contact
          </Link>{" "}
          page.
        </p>
      </section>
    </LegalPageLayout>
  );
}
