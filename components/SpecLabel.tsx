"use client";

import { SERVICE_SPECS, type Service } from "./content";

/**
 * A service rendered as a product spec label — boxed header, bulleted spec
 * rows, inverted footer bar. See DESIGN.md "Spec labels" for why this is the
 * one component allowed hard borders.
 */
export default function SpecLabel({
  service,
  index,
  total,
}: {
  service: Service;
  index: number;
  total: number;
}) {
  const specs = SERVICE_SPECS[service.name] ?? [];
  const unit = String(index + 1).padStart(2, "0");

  return (
    <a
      href="#contact"
      className="spec group flex h-full flex-col transition-transform duration-300 hover:-translate-y-1"
    >
      {/* Header: name against the studio stamp. */}
      <div className="spec-rule flex min-h-[5.5rem] items-stretch">
        <h3 className="t-headline flex-1 px-4 py-4 text-[1.5rem] leading-[0.92] sm:text-[1.75rem]">
          {service.name}
        </h3>
        <div className="t-label flex w-[5.5rem] shrink-0 flex-col justify-center border-l-[1.5px] border-l-ink px-3 py-3 leading-[1.5]">
          <span>2zero2</span>
          <span className="text-ink/55">Service</span>
          <span className="text-ink/55">Unit {unit}</span>
        </div>
      </div>

      {/* Spec rows. */}
      <dl className="flex-1 px-4 py-4">
        {specs.map(([key, value]) => (
          <div key={key} className="flex gap-2 py-[3px]">
            <dt className="t-label w-[5.5rem] shrink-0">· {key}:</dt>
            <dd className="t-body text-[0.8125rem] leading-[1.45]">{value}</dd>
          </div>
        ))}
      </dl>

      {/* Inverted footer bar. */}
      <div className="mx-3 mb-3 flex items-center justify-between gap-3 bg-ink px-3 py-2.5">
        <span className="t-label text-paper">2zero2.build</span>
        <span className="t-label flex items-center gap-2 text-paper">
          {unit} / {String(total).padStart(2, "0")}
          {/* Abstract code mark — a label's registration glyph, not a real code. */}
          <svg width="15" height="15" viewBox="0 0 15 15" aria-hidden="true" className="shrink-0">
            <rect x="0" y="0" width="15" height="15" fill="var(--color-paper)" />
            {[
              [1, 1], [3, 1], [7, 1], [11, 1], [13, 1],
              [1, 3], [5, 3], [9, 3], [13, 3],
              [3, 5], [7, 5], [11, 5],
              [1, 7], [5, 7], [9, 7], [13, 7],
              [3, 9], [7, 9], [11, 9],
              [1, 11], [5, 11], [9, 11], [13, 11],
              [1, 13], [3, 13], [7, 13], [11, 13], [13, 13],
            ].map(([x, y]) => (
              <rect key={`${x}-${y}`} x={x} y={y} width="1.6" height="1.6" fill="var(--color-ink)" />
            ))}
          </svg>
        </span>
      </div>
    </a>
  );
}
