import Link from "next/link";
import { CONTACT_EMAIL } from "./content";

export default function Footer() {
  return (
    <footer
      className="rule-t"
      style={{ paddingInline: "var(--gutter)", paddingBlock: "clamp(3rem,6vw,5rem)" }}
    >
      <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/2zero2_wordmark_white.svg"
            alt="2zero2"
            width={130}
            height={71}
            className="h-9 w-auto"
          />
          <p className="t-label mt-6 text-dim">
            Digital agency · Worldwide
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-3">
          <Link href="/work" className="t-label text-paper/70 hover:text-signal">
            Work
          </Link>
          <Link href="/#services" className="t-label text-paper/70 hover:text-signal">
            Services
          </Link>
          <Link href="/#studio" className="t-label text-paper/70 hover:text-signal">
            Studio
          </Link>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="t-label text-paper/70 hover:text-signal"
          >
            {CONTACT_EMAIL}
          </a>
        </nav>
      </div>

      <p className="t-label mt-14 text-dim">
        © {new Date().getFullYear()} 2zero2 · All rights reserved
      </p>
    </footer>
  );
}
