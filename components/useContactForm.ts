"use client";

import { useState } from "react";

export type FormStatus = "idle" | "submitting" | "success" | "error";

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
      email: (fd.get("email") as string) || "",
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
