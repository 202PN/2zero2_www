"use client";

import type { FormEvent } from "react";
import { PROJECT_TYPES, TIMELINES } from "./content";
import { useContactForm } from "./useContactForm";

const field =
  "t-body w-full border-0 border-b border-b-paper/30 bg-transparent pt-2 pb-3 text-[1.05rem] text-paper transition-colors placeholder:text-dim/70 hover:border-b-paper/55 focus:border-b-signal focus:outline-none";

function Pills({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  return (
    <fieldset>
      <legend className="t-label text-dim">{label}</legend>
      <div className="mt-4 flex flex-wrap gap-2">
        {options.map((option) => {
          const on = value === option;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(on ? null : option)}
              className={`t-label min-h-11 border px-4 py-2 transition-colors ${
                on
                  ? "border-signal bg-signal text-ink"
                  : "border-[color:var(--rule-dark)] text-paper/70 hover:border-paper/50 hover:text-paper"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function ContactForm() {
  const {
    projectType,
    setProjectType,
    timeline,
    setTimeline,
    status,
    error,
    submit,
  } = useContactForm();

  if (status === "success") {
    return (
      <div className="rule-t rule-b py-14">
        <p className="t-headline text-[2rem] text-signal">Received.</p>
        <p className="t-body mt-4 max-w-[42ch] text-dim">
          We read every message ourselves. Expect a reply within one business day.
        </p>
      </div>
    );
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void submit(e.currentTarget);
  }

  return (
    /* action/method keep this working when the client JS never arrives. */
    <form
      onSubmit={onSubmit}
      action="/api/contact"
      method="POST"
      className="flex flex-col gap-12"
    >
      <div className="grid gap-10 sm:grid-cols-2">
        <label className="block">
          <span className="t-label text-dim">Your name</span>
          <input name="name" required autoComplete="name" className={field} />
        </label>
        <label className="block">
          <span className="t-label text-dim">Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className={field}
          />
        </label>
      </div>

      <Pills
        label="Project type"
        options={PROJECT_TYPES}
        value={projectType}
        onChange={setProjectType}
      />
      <Pills
        label="Timeline"
        options={TIMELINES}
        value={timeline}
        onChange={setTimeline}
      />

      <label className="block">
        <span className="t-label text-dim">What are you building?</span>
        <textarea name="message" required rows={4} className={`${field} resize-none`} />
      </label>

      {/* Honeypot — real people never see it. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute h-0 w-0 overflow-hidden opacity-0"
      />
      <input type="hidden" name="projectType" value={projectType ?? ""} />
      <input type="hidden" name="timeline" value={timeline ?? ""} />

      {error && (
        <p role="alert" className="t-label text-signal">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="t-headline group flex w-fit items-center gap-4 border-b-2 border-b-paper pb-2 text-[1.75rem] transition-colors hover:border-b-signal hover:text-signal disabled:opacity-50 sm:text-[2.25rem]"
      >
        {status === "submitting" ? "Sending" : "Send"}
        <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
          →
        </span>
      </button>
    </form>
  );
}
