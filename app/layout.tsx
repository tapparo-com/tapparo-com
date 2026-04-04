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

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://tapparo.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Tapparo",
  description: "Day bar & focacceria",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Tapparo",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSans.variable} ${spaceGrotesk.variable} font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
