import Link from "next/link";
import Wordmark from "./Wordmark";
import { CONTACT_EMAIL, SERVICES } from "./content";

export default function Footer() {
  return (
    <footer
      className="rule-t"
      style={{ paddingInline: "var(--gutter)", paddingBlock: "clamp(3rem,6vw,5rem)" }}
    >
      <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Wordmark className="h-14 w-auto" />
          <p className="t-label mt-6 text-dim">
            Digital agency · Worldwide
          </p>
        </div>

        <nav aria-label="Services" className="flex flex-col gap-3">
          <p className="t-label text-dim">Services</p>
          {SERVICES.map((service) => (
            <Link
              key={service.name}
              href="/#services"
              className="t-label text-paper/70 hover:text-accent"
            >
              {service.name}
            </Link>
          ))}
        </nav>

        <nav aria-label="Studio" className="flex flex-col gap-3">
          <p className="t-label text-dim">Studio</p>
          <Link href="/work" className="t-label text-paper/70 hover:text-accent">
            Work
          </Link>
          <Link href="/#process" className="t-label text-paper/70 hover:text-accent">
            Process
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
