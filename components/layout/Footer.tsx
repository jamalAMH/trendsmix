import Link from "next/link";
import {
  FOOTER_CATEGORY_LINKS,
  FOOTER_COMPANY_LINKS,
  FOOTER_LEGAL_LINKS,
  SITE_NAME,
} from "@/lib/constants";
import LogoMark from "@/components/brand/LogoMark";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-zinc-800/80 bg-zinc-950">
      <div className="gradient-mesh border-b border-zinc-800/50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-sm">
              <Link href="/" className="group inline-flex items-center gap-2.5">
                <LogoMark size={30} />
                <span className="font-display text-2xl text-white">
                  {SITE_NAME}
                </span>
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                A premium destination for original fiction — horror, mystery,
                romance, fantasy, and stories that stay with you long after the
                last line.
              </p>
            </div>

            <nav
              aria-label="Footer navigation"
              className="grid gap-10 sm:grid-cols-3"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Genres
                </p>
                <ul className="mt-5 space-y-3">
                  {FOOTER_CATEGORY_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-zinc-400 transition-colors hover:text-orange-400"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Company
                </p>
                <ul className="mt-5 space-y-3">
                  {FOOTER_COMPANY_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-zinc-400 transition-colors hover:text-orange-400"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Legal
                </p>
                <ul className="mt-5 space-y-3">
                  {FOOTER_LEGAL_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-zinc-400 transition-colors hover:text-orange-400"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-zinc-500">
          &copy; {currentYear} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
