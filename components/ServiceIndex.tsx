"use client";

import { useState } from "react";
import { SERVICES } from "./content";
import { selectService } from "./useContactForm";

/**
 * Numbered index rows. Hovering a row dims its siblings and surfaces the
 * row's copy — the list reads as an index first, detail second.
 */
export default function ServiceIndex() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <ul className="rule-t" onMouseLeave={() => setActive(null)}>
      {SERVICES.map((service, i) => {
        const dimmed = active !== null && active !== i;
        return (
          <li key={service.name} className="rule-b">
            <a
              href="#contact"
              onClick={() => selectService(service.type)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="group grid grid-cols-[3.5rem_1fr] items-baseline gap-x-4 py-7 transition-opacity duration-300 sm:grid-cols-[5rem_1fr_minmax(0,26rem)] sm:gap-x-8 sm:py-9"
              style={{ opacity: dimmed ? 0.34 : 1 }}
            >
              <span className="t-serif text-dim text-xl sm:text-2xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="t-headline text-[1.7rem] transition-colors group-hover:text-signal sm:text-[2.6rem]">
                {service.name}
              </h3>
              <p className="t-body col-start-2 mt-3 max-w-[34ch] text-[0.95rem] text-dim sm:col-start-3 sm:mt-0">
                {service.copy}
              </p>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
