import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import ConceptPlate from "@/components/ConceptPlate";
import Ledger from "@/components/Ledger";
import MobileDock from "@/components/MobileDock";
import SiteFooter from "@/components/SiteFooter";
import { SITE } from "@/lib/content";
import "./globals.css";

const display = localFont({
  src: [
    { path: "./fonts/archivo-latin-600-wdth100.woff2", weight: "600", style: "normal" },
    { path: "./fonts/archivo-latin-800-wdth125.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

const body = localFont({
  src: "./fonts/source-serif-4-latin-400-normal.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-body",
  display: "swap",
  fallback: ["Georgia", "serif"],
  adjustFontFallback: "Times New Roman",
});

export const metadata: Metadata = {
  title: {
    default: `Bracken & Board | ${SITE.conceptLabel}`,
    template: `%s | Bracken & Board | ${SITE.conceptLabel}`,
  },
  description: `${SITE.conceptLabel}. Bracken & Board lays decks, paving, retaining and planting in courses. A fictional landscape builder.`,
  other: {
    concept: SITE.conceptLabel,
  },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#E7E0D1",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={`${display.variable} ${body.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Ledger />
        <ConceptPlate />
        <main id="main" data-unit="running-bond">
          {children}
        </main>
        <SiteFooter />
        <MobileDock />
      </body>
    </html>
  );
}
