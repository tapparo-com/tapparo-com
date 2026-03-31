import type { Metadata } from "next";
import { Instrument_Sans, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Tapparo",
  description: "Day bar & focacceria",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSans.variable} ${inter.variable} ${spaceGrotesk.variable} font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
