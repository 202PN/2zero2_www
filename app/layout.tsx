import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import {
  Instrument_Serif,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

/* Archivo variable (OFL) — self-hosted so the wdth axis is available and
   no request leaves the origin. Display and body both ride this family. */
const archivo = localFont({
  src: "./fonts/Archivo-Variable.woff2",
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
    default: "2zero2 · Web apps, marketing sites & launch design",
    template: "%s · 2zero2",
  },
  description:
    "2zero2 designs and builds web applications, marketing sites, website rebuilds, and brand & launch kits through one defined process: scoped up front, built in signed-off milestones, supported after launch.",
  openGraph: {
    title: "2zero2 · Web apps, marketing sites & launch design",
    description:
      "Web applications, marketing sites, and launch design. Shipped fast, built to last.",
    images: [{ url: "/brand/og-board.jpg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${archivo.variable} ${instrument.variable} ${jetbrains.variable}`}
    >
      <head>
        {/* Applies the saved theme and decides whether the intro plays, both
            before the first paint so neither can flash. The curtain is hidden by default (see globals.css), so this
            script can only ever turn it ON — if it throws, or never runs, the
            visitor gets the open site rather than a black screen.

            It only runs on a real page load, which is what keeps the intro
            from replaying on client-side navigation back to "/". */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
if(localStorage.getItem('2z-theme')==='light')document.documentElement.dataset.theme='light';
}catch(e){}
try{
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
if(!(CSS.supports('mask-composite','exclude')||CSS.supports('-webkit-mask-composite','xor')))return;
document.documentElement.dataset.intro='hold';
}catch(e){}})()`,
          }}
        />
      </head>
      <body className="bg-ink text-paper antialiased">
        {children}
      </body>
    </html>
  );
}
