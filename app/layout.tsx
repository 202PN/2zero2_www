import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import {
  DotGothic16,
  Instrument_Serif,
  JetBrains_Mono,
  Pinyon_Script,
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

/* The script half of the lockup. A fine copperplate rather than a brush face:
   it carries the luxury register the rest of the site is in, and its small
   x-height is why it runs much larger than the words beside it. */
const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-script-face",
});

/* Numerals and editorial accents only — the intro counter, section
   numbers, project years. */
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-instrument",
});

/* Retro bitmap face, used for exactly one word in the hero lockup. Light
   enough in the stroke to sit beside a fine copperplate — Press Start 2P read
   as two unrelated objects next to it. */
const dotGothic = DotGothic16({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-pixel-face",
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
    default: "2zero2 · Digital agency",
    template: "%s · 2zero2",
  },
  description:
    "2zero2 is a digital agency building web applications, marketing sites, and launch design for owners, founders, DJs, and promoters. Scoping crew is the build crew.",
  openGraph: {
    title: "2zero2 · Digital agency",
    description:
      "Web applications, marketing sites, and launch design. Shipped fast, built to last.",
    images: [{ url: "/brand/og.jpg", width: 1200, height: 630 }],
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${archivo.variable} ${pinyon.variable} ${dotGothic.variable} ${instrument.variable} ${jetbrains.variable}`}
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
