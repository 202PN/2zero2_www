"use client";

import { useEffect, useRef, useState } from "react";

const SESSION_KEY = "2z-intro-seen";
/* Floor on the counter so a warm cache still gets the beat, and a ceiling
   so a stalled asset can never hold the page shut. */
const MIN_MS = 1600;
const WATCHDOG_MS = 4000;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * The entrance. A black curtain with the 2zero2 mark knocked out of it sits
 * over the already-rendered page; the hole grows until the page is simply
 * open. See globals.css for why it is built as a knockout.
 *
 * @param preload Images to wait on before opening — the hero plate, so the
 *                reveal never lands on an empty frame.
 */
export default function Aperture({ preload = [] }: { preload?: string[] }) {
  // Assume no intro during SSR and the first client paint; the effect turns
  // it on only when we know it should run. Prevents a curtain flash on
  // repeat visits and in reduced-motion.
  const [active, setActive] = useState(false);
  const [state, setState] = useState<"loading" | "open">("loading");
  const [pct, setPct] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) || prefersReducedMotion()) return;
    setActive(true);
  }, []);

  useEffect(() => {
    if (!active) return;

    const root = rootRef.current;
    if (root) {
      // Size the opening off the viewport rather than a fixed length, so the
      // mask raster stays bounded on every screen.
      const reach = Math.max(window.innerWidth, window.innerHeight) * 16;
      root.style.setProperty("--ap-ms-end", `${Math.round(reach)}px`);
      root.style.setProperty(
        "--ap-ms",
        `${Math.round(Math.min(window.innerWidth * 0.46, 470))}px`,
      );
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let raf = 0;
    let done = false;
    const started = performance.now();
    // Real load progress: fonts plus the hero plate. Resolves to 1 when both
    // are settled; the counter takes whichever is slower, this or the floor.
    let assetsReady = 0;
    const assets = Promise.all([
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
    void assets;

    function open() {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      setPct(100);
      // Let 100 land before the hole starts growing.
      window.setTimeout(() => setState("open"), 200);
      window.setTimeout(() => {
        document.body.style.overflow = prevOverflow;
        sessionStorage.setItem(SESSION_KEY, "1");
        setActive(false);
      }, 200 + 1600);
    }

    function tick(now: number) {
      const elapsed = now - started;
      const floor = Math.min(elapsed / MIN_MS, 1);
      // Ease the tail so it decelerates into 100 instead of snapping.
      const value = Math.min(floor, 0.92 + assetsReady * 0.08) * 100;
      setPct(Math.min(99, Math.floor(value)));
      if (floor >= 1 && assetsReady === 1) return open();
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    const watchdog = window.setTimeout(open, WATCHDOG_MS);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(watchdog);
      document.body.style.overflow = prevOverflow;
    };
  }, [active, preload]);

  if (!active) return null;

  return (
    <div
      ref={rootRef}
      className="ap-root fixed inset-0 z-[100]"
      data-state={state}
      aria-hidden="true"
    >
      <div className="ap-curtain grain">
        <div className="ap-grid grid-field absolute inset-0" />
        {/* Eight hairlines radiating from center — the reference's backdrop. */}
        <svg
          className="ap-rays"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
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
