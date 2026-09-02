"use client";

import { useEffect } from "react";

/** Cleared by the fixed header so anchor targets don't land under it. */
const HEADER_OFFSET = -88;

/**
 * Weighted smooth scroll, plus the single rAF loop that drives every image
 * plate's scroll-linked scale. One loop for all plates — not one per plate.
 *
 * Also routes same-page hash links through Lenis: it owns the scroll
 * position, so a native anchor jump fights it and lands nowhere.
 *
 * All of it is skipped under `prefers-reduced-motion`, where the browser's
 * own anchor behavior is correct on its own.
 */
export function useLenis() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let lenis: {
      raf(t: number): void;
      destroy(): void;
      scrollTo(t: string | HTMLElement, o?: { offset?: number }): void;
    } | null = null;
    let cancelled = false;

    const plates = Array.from(
      document.querySelectorAll<HTMLElement>("[data-plate]"),
    );

    function updatePlates() {
      const vh = window.innerHeight;
      for (const el of plates) {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) continue;
        // 0 as the plate enters from below, 1 as it exits the top.
        const p = 1 - (r.top + r.height) / (vh + r.height);
        el.style.setProperty("--plate-scale", (1 + p * 0.08).toFixed(4));
      }
    }

    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Same-page hash only: "#id" here, or "/#id" while on "/".
      let hash = "";
      if (href.startsWith("#")) hash = href;
      else if (href.startsWith("/#") && window.location.pathname === "/") {
        hash = href.slice(1);
      }
      if (hash.length < 2) return;

      const target = document.querySelector<HTMLElement>(hash);
      if (!target || !lenis) return;

      event.preventDefault();
      lenis.scrollTo(target, { offset: HEADER_OFFSET });
      history.replaceState(null, "", hash);
    }

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({ duration: 1.1, smoothWheel: true });
      const loop = (time: number) => {
        lenis?.raf(time);
        updatePlates();
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);

      // If the page was opened at a hash, Lenis needs to be told.
      if (window.location.hash.length > 1) {
        const target = document.querySelector<HTMLElement>(window.location.hash);
        if (target) lenis.scrollTo(target, { offset: HEADER_OFFSET });
      }
    });

    document.addEventListener("click", onClick);

    return () => {
      cancelled = true;
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, []);
}
