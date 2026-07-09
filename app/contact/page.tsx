import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Contact Us",
  description:
    "Reach the TrendsMix team for questions, partnership enquiries, story submissions, press requests, or general feedback.",
  path: "/contact",
});

export default function ContactPage() {
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
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400">
          Whether you have a question about our platform, want to discuss a
          partnership, or need to report an issue — we are here to help. Fill out
          the form below and our team will respond within two business days.
        </p>
      </header>

      <form
        className="mt-10 space-y-6"
        aria-labelledby="contact-heading"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="first-name"
              className="block text-sm font-medium text-zinc-300"
            >
              First Name
            </label>
            <input
              id="first-name"
              name="first-name"
              type="text"
              autoComplete="given-name"
              required
              aria-required="true"
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              placeholder="Jane"
            />
          </div>
          <div>
            <label
              htmlFor="last-name"
              className="block text-sm font-medium text-zinc-300"
            >
              Last Name
            </label>
            <input
              id="last-name"
              name="last-name"
              type="text"
              autoComplete="family-name"
              required
              aria-required="true"
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              placeholder="Doe"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-zinc-300"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-required="true"
            className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            placeholder="jane@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-zinc-300"
          >
            Subject
          </label>
          <select
            id="subject"
            name="subject"
            required
            aria-required="true"
            className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            defaultValue=""
          >
            <option value="" disabled>
              Select a topic
            </option>
            <option value="general">General Enquiry</option>
            <option value="partnership">Partnership &amp; Advertising</option>
            <option value="submission">Story Submission</option>
            <option value="press">Press &amp; Media</option>
            <option value="bug">Bug Report</option>
            <option value="dmca">DMCA / Copyright</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-zinc-300"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            aria-required="true"
            className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            placeholder="Please provide as much detail as possible..."
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-orange-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-400 hover:shadow-orange-500/30 sm:w-auto"
        >
          Send Message
        </button>
      </form>

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
