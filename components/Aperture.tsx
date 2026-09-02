"use client";

import { useEffect, useRef, useState } from "react";
import { INTRO_SESSION_KEY } from "./intro";

/* Floor on the counter so a warm cache still gets the beat, and a ceiling so
   a stalled asset can never hold the page shut. */
const MIN_MS = 1600;
const WATCHDOG_MS = 4000;
const OPEN_DELAY_MS = 200;
const OPEN_MS = 1600;

/**
 * The entrance. A black curtain with the 2zero2 mark knocked out of it sits
 * over the page; the hole grows until the page is simply open.
 *
 * This renders on the server so the curtain is part of the very first paint —
 * otherwise the site flashes into view before the curtain lands on top of it.
 * Whether it is actually *visible* is decided before paint by the gate script
 * in app/layout.tsx, which adds `ap-run` to <html>. Without that class the
 * curtain is `display: none`, so every failure mode (no JS, script error,
 * reduced motion, repeat visit, no mask support) resolves to an open site.
 *
 * @param preload Images to wait on before opening — the hero plate, so the
 *                reveal never lands on an empty frame.
 */
export default function Aperture({ preload = [] }: { preload?: string[] }) {
  // Present for SSR and the first client render; CSS decides if it shows.
  const [mounted, setMounted] = useState(true);
  const [state, setState] = useState<"loading" | "open">("loading");
  const [pct, setPct] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    // The gate script is the single source of truth on whether we run. If it
    // did not arm us (no JS at parse time, reduced motion, repeat visit, no
    // mask support), drop the markup and leave the page alone.
    if (document.documentElement.dataset.intro !== "hold") {
      setMounted(false);
      return;
    }

    // Size the opening off the viewport rather than a fixed length, so the
    // mask raster stays bounded on every screen.
    const reach = Math.max(window.innerWidth, window.innerHeight) * 16;
    root?.style.setProperty("--ap-ms-end", `${Math.round(reach)}px`);

    let raf = 0;
    let done = false;
    const timers: number[] = [];
    const started = performance.now();

    // Real load progress: fonts plus the hero plate. The counter takes
    // whichever is slower, this or the floor.
    let assetsReady = 0;
    void Promise.all([
      document.fonts.ready,
      ...preload.map(
        (src) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = img.onerror = () => resolve();
            img.src = src;
          }),
      ),
    ]).then(() => {
      assetsReady = 1;
    });

    function finish() {
      delete document.documentElement.dataset.intro;
      try {
        sessionStorage.setItem(INTRO_SESSION_KEY, "1");
      } catch {
        /* private mode — the intro just plays again next load */
      }
      setMounted(false);
    }

    function open() {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      setPct(100);
      // Let 100 land before the hole starts growing.
      timers.push(
        window.setTimeout(() => {
          setState("open");
          // Releases the header and hero copy to enter behind the curtain.
          document.documentElement.dataset.intro = "open";
        }, OPEN_DELAY_MS),
      );
      timers.push(window.setTimeout(finish, OPEN_DELAY_MS + OPEN_MS));
    }

    function tick(now: number) {
      const floor = Math.min((now - started) / MIN_MS, 1);
      // Hold at 92 until the assets actually land, so the last eight percent
      // means something.
      setPct(Math.min(99, Math.floor(Math.min(floor, 0.92 + assetsReady * 0.08) * 100)));
      if (floor >= 1 && assetsReady === 1) return open();
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    timers.push(window.setTimeout(open, WATCHDOG_MS));

    // Only cancel work here — deliberately does NOT clear `data-intro`, so a
    // remount (React StrictMode double-invokes effects in dev) still sees
    // "hold" and picks the intro back up instead of bailing out of it.
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, [preload]);

  if (!mounted) return null;

  return (
    <div ref={rootRef} className="ap-root fixed inset-0 z-[100]" data-state={state} aria-hidden="true">
      <div className="ap-curtain grain">
        <div className="ap-grid grid-field absolute inset-0" />
        {/* Eight hairlines converging on the mark, as in the reference. */}
        <svg className="ap-rays" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4;
            return (
              <line
                key={i}
                x1="50"
                y1="50"
                x2={50 + Math.cos(a) * 90}
                y2={50 + Math.sin(a) * 90}
                stroke="rgba(255,255,255,0.09)"
                strokeWidth="0.12"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>
      </div>

      {/* Outside the curtain so the mask never clips it. */}
      <div className="ap-counter pointer-events-none absolute inset-0 flex items-end justify-center pb-[14vh]">
        <span
          className="t-serif tabular-nums"
          style={{
            fontSize: "clamp(2rem, 4vw, 3.25rem)",
            color: pct >= 100 ? "var(--color-signal)" : "rgba(255,255,255,0.62)",
            transition: "color 260ms ease-out",
          }}
        >
          {String(pct).padStart(2, "0")}
          <span style={{ fontSize: "0.44em", verticalAlign: "super" }}>%</span>
        </span>
      </div>
    </div>
  );
}
