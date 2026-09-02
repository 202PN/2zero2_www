import Link from "next/link";
import Wordmark from "./Wordmark";
import { CONTACT_EMAIL } from "./content";

export default function Footer() {
  return (
    <footer
      className="rule-t"
      style={{ paddingInline: "var(--gutter)", paddingBlock: "clamp(3rem,6vw,5rem)" }}
    >
      <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Wordmark className="h-14 w-auto" />
          <p className="t-label mt-6 text-dim">
            Digital agency · Worldwide
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-3">
          <Link href="/work" className="t-label text-paper/70 hover:text-accent">
            Work
          </Link>
          <Link href="/#services" className="t-label text-paper/70 hover:text-accent">
            Services
          </Link>
          <Link href="/#studio" className="t-label text-paper/70 hover:text-accent">
            Studio
          </Link>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="t-label text-paper/70 hover:text-accent"
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
