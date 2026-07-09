import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

const LEGAL_NAV = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/cookies", label: "Cookie Policy" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/editorial-policy", label: "Editorial Policy" },
  { href: "/ai-policy", label: "AI Content Policy" },
  { href: "/dmca", label: "DMCA Policy" },
] as const;

export default function LegalPageLayout({
  title,
  lastUpdated,
  children,
}: LegalPageLayoutProps) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-medium text-orange-400">{SITE_NAME}</p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-zinc-500">
          Last updated: <time dateTime={lastUpdated}>{lastUpdated}</time>
        </p>
      </header>

      <div className="mt-10 space-y-10 text-base leading-relaxed text-zinc-400">
        {children}
      </div>

      <aside
        aria-label="Related policies"
        className="mt-16 border-t border-zinc-800/80 pt-10"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Related Policies
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {LEGAL_NAV.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inline-block rounded-lg border border-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:border-orange-500/30 hover:text-orange-400"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </article>
  );
}
