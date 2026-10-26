import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import SiteHeader, { ConceptBar } from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

const body = localFont({
  src: "./fonts/manrope-latin-wght-normal.woff2",
  weight: "200 800",
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Bracken & Board | Landscaping and outdoor construction",
    template: "%s | Bracken & Board",
  },
  description:
    "Bracken & Board designs and builds decks, paving and gardens. A fictional landscape builder, created as an OFF/SHIFT Studio concept.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#E8E4DA",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={body.variable}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <ConceptBar />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

