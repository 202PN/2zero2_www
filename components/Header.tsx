"use client";

import Link from "next/link";
import Wordmark from "./Wordmark";
import { useEffect, useState } from "react";

/* Styling lives in globals.css so the light print can fill it rather than
   outline it. */
const CONTACT_CELL = "t-label contact-cell";

const NAV = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/#services" },
  { label: "Studio", href: "/#studio" },
  /* Boxed in the desktop nav — the site's only nav affordance that reads as a
     control, standing in for the CTA the hero deliberately doesn't carry. */
  { label: "Contact", href: "/#contact", boxed: true },
];

export default function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The mobile index covers the page; don't let the page scroll behind it.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className={`intro-enter-fade fixed inset-x-0 top-0 z-50 ${
          solid ? "bg-ink/90 backdrop-blur-md rule-b" : "bg-transparent"
        }`}
      >
        <div
          className="flex items-center justify-between"
          style={{
            paddingInline: "var(--gutter)",
            paddingBlock: "clamp(0.9rem, 1.6vw, 1.35rem)",
          }}
        >
          <Link
            href="/"
            aria-label="2zero2, home"
            className="shrink-0 transition-opacity hover:opacity-70"
          >
            <Wordmark className="h-[34px] w-auto sm:h-[40px]" />
          </Link>

          <nav className="hidden items-center gap-9 md:flex">
            {NAV.map((item) =>
              item.boxed ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${CONTACT_CELL} px-3.5 py-2`}
                >
                  {item.label}
                </Link>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="t-label text-paper/70 transition-colors hover:text-accent"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2.5 md:hidden">
            <Link href="/#contact" className={`${CONTACT_CELL} px-3 py-1.5`}>
              Contact
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-index"
              aria-label={open ? "Close menu" : "Open menu"}
              className="-mr-2 flex h-11 w-11 items-center justify-center text-paper"
            >
              {/* Three bars that collapse into a cross while the index is open. */}
              <span className="relative block h-[14px] w-[22px]" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="absolute left-0 block h-[2px] w-full bg-current transition-transform duration-300"
                    style={{
                      top: i === 1 ? "6px" : i === 0 ? "0px" : "12px",
                      transform: open
                        ? i === 1
                          ? "scaleX(0)"
                          : `translateY(${i === 0 ? 6 : -6}px) rotate(${i === 0 ? 45 : -45}deg)`
                        : "none",
                    }}
                  />
                ))}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile index */}
      <div
        id="mobile-index"
        hidden={!open}
        className="fixed inset-0 z-40 flex flex-col justify-center bg-ink md:hidden"
        style={{ paddingInline: "var(--gutter)" }}
      >
        <nav className="flex flex-col">
          {NAV.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rule-b flex items-baseline justify-between py-6"
            >
              <span className="t-headline text-[2.4rem]">{item.label}</span>
              <span className="t-serif text-dim text-lg">
                {String(i + 1).padStart(2, "0")}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
