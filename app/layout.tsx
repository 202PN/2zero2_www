import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import { Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/* Archivo variable (OFL) — self-hosted so the wdth axis is available and
   no request leaves the origin. Display and body both ride this family. */
const archivo = localFont({
  src: "./fonts/Archivo-Variable.ttf",
  weight: "100 900",
  display: "swap",
  variable: "--font-archivo",
});

/* Numerals and editorial accents only — the intro counter, section
   numbers, project years. */
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-instrument",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://2zero2.build"),
  title: {
    default: "2zero2 — Digital agency",
    template: "%s · 2zero2",
  },
  description:
    "2zero2 is a digital agency building web applications, marketing sites, and MVPs for small businesses, owners, and founders. Scoping crew is the build crew.",
  openGraph: {
    title: "2zero2 — Digital agency",
    description:
      "Web applications, marketing sites, and MVPs. Shipped fast, built to last.",
    images: [{ url: "/brand/og.jpg", width: 1200, height: 630 }],
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${instrument.variable} ${jetbrains.variable}`}
    >
      <body className="bg-ink text-paper antialiased">
        {children}
      </body>
    </html>
  );
}
