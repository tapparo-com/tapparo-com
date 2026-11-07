import { siteOrigin } from "@/lib/urls";
import { canIndexSite } from "@/lib/seo";
import type { Metadata } from "next";
import { Instrument_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin()),
  title: "Tapparo",
  description: "Day bar & focacceria",
  ...(!canIndexSite() && { robots: { index: false, follow: false } }),
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "Tapparo",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body
        className={`${instrumentSans.variable} ${spaceGrotesk.variable} font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
