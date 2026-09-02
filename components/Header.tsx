"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const NAV = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/#services" },
  { label: "Studio", href: "/#studio" },
  { label: "Contact", href: "/#contact" },
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
            aria-label="2zero2 — home"
            className="shrink-0 transition-opacity hover:opacity-70"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/2zero2_wordmark_white.svg"
              alt="2zero2"
              width={92}
              height={50}
              className="h-[26px] w-auto sm:h-[30px]"
            />
          </Link>

          <nav className="hidden items-center gap-9 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="t-label text-paper/70 transition-colors hover:text-signal"
              >
                {item.label}
              </Link>
            ))}
            <span
              className="t-label flex items-center gap-2 text-paper/60"
              title="Currently taking new projects"
            >
              <span
                className="inline-block h-[6px] w-[6px] rounded-full bg-signal"
                aria-hidden="true"
              />
              Available
            </span>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-index"
            className="t-label -mr-1 flex h-11 items-center px-1 text-paper md:hidden"
          >
            {open ? "Close" : "Index"}
          </button>
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
