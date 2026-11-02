"use client";

import { useEffect, useState, type FormEvent } from "react";
import { SERVICES } from "./content";
import { onPickService, useContactForm } from "./useContactForm";

/* Boxed rather than underlined. A bottom rule reads fine under a single line,
   but under a five-row textarea it sits far below the label with nothing
   between, so the field looks like empty page. */
const field =
  "t-body mt-3 w-full border border-paper/25 bg-transparent px-3.5 py-3 text-[1.05rem] text-paper transition-colors placeholder:text-dim/70 hover:border-paper/50 focus:border-accent focus:outline-none";

const NOT_SURE = "Not sure yet";

export default function ContactForm() {
  const { status, error, submit } = useContactForm();
  const [service, setService] = useState("");

  // A service label further up the page picks its service here.
  useEffect(() => onPickService(setService), []);

  if (status === "success") {
    return (
      <div className="rule-t rule-b py-14">
        <p className="t-headline text-[2rem] text-accent">Received.</p>
        <p className="t-body mt-4 max-w-[42ch] text-dim">
          Thanks for the details. We&rsquo;ll follow up with next steps.
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
      className="flex flex-col gap-10"
    >
      <fieldset>
        <legend className="t-label text-dim">What do you need?</legend>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {[...SERVICES.map((s) => s.name), NOT_SURE].map((name) => (
            <label key={name} className="pill">
              <input
                type="radio"
                name="service"
                value={name}
                checked={service === name}
                onChange={() => setService(name)}
                className="sr-only"
              />
              <span className="t-label">{name}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-10 sm:grid-cols-2 sm:gap-6">
        <label className="block">
          <span className="t-label text-dim">Name</span>
          <input name="name" type="text" autoComplete="name" className={field} />
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

      <label className="block">
        <span className="t-label text-dim">What are you building?</span>
        <textarea
          name="message"
          required
          rows={6}
          placeholder="A sentence or two is plenty: what it is, who it's for, and any date you're working to."
          className={`${field} block resize-none`}
        />
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

      {error && (
        <p role="alert" className="t-label text-accent">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="t-headline group flex w-fit items-center gap-4 border-b-2 border-b-paper pb-2 text-[1.75rem] transition-colors hover:border-b-accent hover:text-accent disabled:opacity-50 sm:text-[2.25rem]"
      >
        {status === "submitting" ? "Sending" : "Send"}
        <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
          →
        </span>
      </button>
    </form>
  );
}
