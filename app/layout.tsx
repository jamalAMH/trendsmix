import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SkipLink from "@/components/layout/SkipLink";
import JsonLd from "@/components/seo/JsonLd";
import AnalyticsTracker from "@/components/analytics/AnalyticsTracker";
import GoogleAnalyticsScript from "@/components/analytics/GoogleAnalyticsScript";
import AdSenseScript from "@/components/analytics/AdSenseScript";
import { createMetadataBase, websiteJsonLd } from "@/lib/seo";
import { getSetting } from "@/lib/settings";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
});

export async function generateMetadata(): Promise<Metadata> {
  const verification = await getSetting("google_site_verification");

  return {
    ...createMetadataBase(),
    ...(verification
      ? { verification: { google: verification } }
      : {}),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full dark antialiased`}
    >
      <body className="flex min-h-full flex-col bg-zinc-950 text-zinc-100">
        <GoogleAnalyticsScript />
        <AdSenseScript />
        <AnalyticsTracker />
        <SkipLink />
        <JsonLd data={websiteJsonLd()} />
        <Header />
        <main id="main-content" className="flex-1" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
