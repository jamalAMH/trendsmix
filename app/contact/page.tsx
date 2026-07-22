import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/contact/ContactForm";
import { SITE_NAME } from "@/lib/constants";
import { getSetting } from "@/lib/settings";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Contact Us",
  description:
    "Reach the TrendsMix team for questions, partnership enquiries, story submissions, press requests, or general feedback.",
  path: "/contact",
});

export default async function ContactPage() {
  const contactEmail =
    (await getSetting("contact_email")) || "contact@trendsmix.online";

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-medium text-orange-400">{SITE_NAME}</p>
        <h1
          id="contact-heading"
          className="mt-2 text-3xl font-bold text-white sm:text-4xl"
        >
          Contact Us
        </h1>
      </header>

      <ContactForm email={contactEmail} />

      <div className="mt-14 grid gap-8 border-t border-zinc-800/80 pt-10 sm:grid-cols-2">
        <section aria-labelledby="contact-response-heading">
          <h2
            id="contact-response-heading"
            className="text-lg font-semibold text-white"
          >
            Response Times
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            We aim to respond to all enquiries within two business days. For
            urgent matters — including{" "}
            <Link
              href="/dmca"
              className="text-orange-400 underline decoration-orange-400/30 underline-offset-2 transition-colors hover:text-orange-300"
            >
              DMCA takedown requests
            </Link>{" "}
            — please indicate the urgency in your subject line.
          </p>
        </section>

        <section aria-labelledby="contact-policies-heading">
          <h2
            id="contact-policies-heading"
            className="text-lg font-semibold text-white"
          >
            Policies &amp; Legal
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            Before reaching out, you may find your answer in our{" "}
            <Link
              href="/privacy"
              className="text-orange-400 underline decoration-orange-400/30 underline-offset-2 transition-colors hover:text-orange-300"
            >
              Privacy Policy
            </Link>
            ,{" "}
            <Link
              href="/terms"
              className="text-orange-400 underline decoration-orange-400/30 underline-offset-2 transition-colors hover:text-orange-300"
            >
              Terms of Service
            </Link>
            , or{" "}
            <Link
              href="/editorial-policy"
              className="text-orange-400 underline decoration-orange-400/30 underline-offset-2 transition-colors hover:text-orange-300"
            >
              Editorial Policy
            </Link>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
