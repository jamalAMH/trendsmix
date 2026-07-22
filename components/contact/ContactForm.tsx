"use client";

import { useState } from "react";

const SUBJECT_LABELS: Record<string, string> = {
  general: "General Enquiry",
  partnership: "Partnership & Advertising",
  submission: "Story Submission",
  press: "Press & Media",
  bug: "Bug Report",
  dmca: "DMCA / Copyright",
  other: "Other",
};

interface ContactFormProps {
  email: string;
}

export default function ContactForm({ email }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "opened">("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const firstName = String(data.get("first-name") ?? "").trim();
    const lastName = String(data.get("last-name") ?? "").trim();
    const fromEmail = String(data.get("email") ?? "").trim();
    const subjectKey = String(data.get("subject") ?? "general");
    const message = String(data.get("message") ?? "").trim();

    const subject = `[TrendsMix] ${SUBJECT_LABELS[subjectKey] ?? "Enquiry"} — ${firstName} ${lastName}`.trim();
    const body = [
      `Name: ${firstName} ${lastName}`.trim(),
      `Email: ${fromEmail}`,
      `Topic: ${SUBJECT_LABELS[subjectKey] ?? subjectKey}`,
      "",
      message,
    ].join("\n");

    const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setStatus("opened");
  }

  return (
    <>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400">
        Email us at{" "}
        <a
          href={`mailto:${email}`}
          className="font-medium text-orange-400 underline decoration-orange-400/30 underline-offset-2 transition-colors hover:text-orange-300"
        >
          {email}
        </a>{" "}
        or use the form below. We aim to respond within two business days.
      </p>

      <form
        className="mt-10 space-y-6"
        aria-labelledby="contact-heading"
        onSubmit={handleSubmit}
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

        {status === "opened" ? (
          <p className="text-sm text-zinc-400" role="status">
            Your email app should open with the message ready. If it does not,
            write to us directly at{" "}
            <a
              href={`mailto:${email}`}
              className="text-orange-400 underline decoration-orange-400/30 underline-offset-2"
            >
              {email}
            </a>
            .
          </p>
        ) : null}
      </form>
    </>
  );
}
