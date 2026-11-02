"use client";

import { SERVICE_SPECS, type Service } from "./content";
import { pickService } from "./useContactForm";

/**
 * A service rendered as a product spec label — boxed header, how it's
 * engaged, the pitch, spec rows, inverted footer bar. See DESIGN.md "Spec labels" for
 * why this is the one component allowed hard borders.
 *
 * The whole label is the call to action: it scrolls to the contact form with
 * this service already selected.
 */
export default function SpecLabel({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const specs = SERVICE_SPECS[service.name] ?? [];
  const unit = String(index + 1).padStart(2, "0");

  return (
    <a
      href="#contact"
      onClick={() => pickService(service.name)}
      className="spec group flex h-full flex-col transition-transform duration-300 hover:-translate-y-1"
    >
      {/* Header: name against its index number. */}
      <div className="spec-rule flex items-start justify-between gap-4 px-4 py-4">
        <h3 className="t-headline text-[1.5rem] leading-[0.92] sm:text-[1.75rem]">
          {service.name}
        </h3>
        <span className="t-serif text-xl leading-none text-ink/55">{unit}</span>
      </div>

      {/* How it's engaged. Fixed scope is outlined, ongoing is solid, so the
          two kinds read apart at a glance. */}
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 px-4 pt-4">
        <span
          className={`t-label px-2 py-1 ${
            service.engagement.type === "Ongoing"
              ? "bg-ink text-paper"
              : "border border-ink"
          }`}
        >
          {service.engagement.type}
        </span>
        <span className="t-label text-ink/60">{service.engagement.terms}</span>
      </div>

      <p className="t-body px-4 pt-3 text-[0.95rem] leading-[1.5]">{service.copy}</p>

      {/* Spec rows. */}
      <dl className="flex-1 px-4 pt-4 pb-5">
        {specs.map(([key, value]) => (
          <div key={key} className="flex gap-2 py-[3px]">
            <dt className="t-label w-[5.5rem] shrink-0 text-ink/60">{key}</dt>
            <dd className="t-body text-[0.8125rem] leading-[1.45]">{value}</dd>
          </div>
        ))}
      </dl>

      {/* Inverted footer bar. */}
      <div className="mx-3 mb-3 flex items-center justify-between gap-3 bg-ink px-3 py-2.5 text-paper">
        <span className="t-label">Start this project</span>
        <span
          aria-hidden="true"
          className="t-label transition-transform duration-300 group-hover:translate-x-1"
        >
          →
        </span>
      </div>
    </a>
  );
}
