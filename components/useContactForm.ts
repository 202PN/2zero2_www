"use client";

import { useState } from "react";

export type FormStatus = "idle" | "submitting" | "success" | "error";

/* A service label pre-selects its service in the form. The two never share a
   parent, so the choice travels as a window event. */
const PICK_SERVICE = "2z:pick-service";

export function pickService(name: string) {
  window.dispatchEvent(new CustomEvent(PICK_SERVICE, { detail: name }));
}

export function onPickService(handler: (name: string) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<string>).detail);
  window.addEventListener(PICK_SERVICE, listener);
  return () => window.removeEventListener(PICK_SERVICE, listener);
}

/*
 * Contact form behaviour: the same POST /api/contact the live site uses.
 * Email is the only required field — the worker enforces that too.
 */
export function useContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(form: HTMLFormElement) {
    const fd = new FormData(form);
    const payload = {
      name: (fd.get("name") as string) || "",
      email: (fd.get("email") as string) || "",
      service: (fd.get("service") as string) || "",
      message: (fd.get("message") as string) || "",
      company: (fd.get("company") as string) || "", // honeypot
    };

    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(result.error || "Something went wrong.");
      form.reset();
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again."
      );
    }
  }

  return { status, setStatus, error, submit };
}
