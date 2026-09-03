"use client";

import { useEffect, useState } from "react";

export const THEME_KEY = "2z-theme";

/**
 * The theme control, disguised as the sun breaking through the cloud plate.
 *
 * Deliberately not in the chrome: it sits in a gap in the photograph, so
 * switching prints feels like the weather changing rather than a settings
 * toggle. Placement is a percentage of the hero, tuned to a bright pocket of
 * open sky in `plate-hero.webp`.
 *
 * Because it is out of the chrome it has to say what it is, so brackets frame
 * the mark and a mono label names the print it will switch to. The brackets
 * open on hover — the one bit of wit — which reads as the control acknowledging
 * the pointer without moving anything else.
 */
export default function Sun() {
  const [light, setLight] = useState(false);

  // The pre-paint script in layout.tsx has already applied the theme; this
  // only syncs React to what is on the document.
  useEffect(() => {
    setLight(document.documentElement.dataset.theme === "light");
  }, []);

  function toggle() {
    const next = !light;
    setLight(next);
    if (next) document.documentElement.dataset.theme = "light";
    else delete document.documentElement.dataset.theme;
    try {
      localStorage.setItem(THEME_KEY, next ? "light" : "dark");
    } catch {
      /* private mode — the choice just won't survive the session */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={light}
      aria-label={light ? "Switch to the dark theme" : "Switch to the light theme"}
      className="sun top-[13%] right-[17%]"
    >
      <span className="sun-disc h-[clamp(2.2rem,4.2vw,3.3rem)] w-[clamp(2.2rem,4.2vw,3.3rem)]">
        <span className="sun-halo" aria-hidden="true" />
        <svg viewBox="0 0 100 100" className="relative h-full w-full" aria-hidden="true">
          <g className="sun-rays">
            {Array.from({ length: 8 }, (_, i) => {
              const a = (i * Math.PI) / 4;
              return (
                <rect
                  key={i}
                  x="48.4"
                  y="4"
                  width="3.2"
                  height="13"
                  fill="var(--color-sun)"
                  transform={`rotate(${(a * 180) / Math.PI} 50 50)`}
                />
              );
            })}
          </g>
          <circle cx="50" cy="50" r="25" fill="var(--color-sun)" />
        </svg>
      </span>

      {/* The mark alone does not read as a control out here in the plate. */}
      <span className="t-label sun-label" aria-hidden="true">
        [ click ]
      </span>
    </button>
  );
}
