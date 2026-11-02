"use client";

import { useEffect, useState } from "react";

export const THEME_KEY = "2z-theme";

/**
 * The theme control: an LED and a mono label naming the current print, in the
 * same indicator language as the hero board. Lit green on the dark print, off
 * on the light one.
 */
export default function ThemeSwitch({ className = "" }: { className?: string }) {
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
      aria-label={light ? "Light theme on. Switch to dark" : "Dark theme on. Switch to light"}
      className={`theme-switch t-label flex h-11 items-center gap-2 ${className}`}
    >
      <span className="theme-led" aria-hidden="true" />
      {/* Both labels ship and CSS picks one, so a light-print load never
          flashes the wrong word before React hydrates. */}
      <span className="on-dark" aria-hidden="true">Dark</span>
      <span className="on-light" aria-hidden="true">Light</span>
    </button>
  );
}
