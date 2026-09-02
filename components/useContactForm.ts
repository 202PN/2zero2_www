"use client";

import { useEffect, useState } from "react";
import { PROJECT_TYPES } from "./content";

export type FormStatus = "idle" | "submitting" | "success" | "error";

/*
 * Shared contact-form behavior for every redesign candidate: same
 * POST /api/contact payload as the live homepage (name, email, message,
 * honeypot `company`, projectType, timeline), so each version's form is
 * fully working, not a prop. Listens for `service:select` so a service
 * row can pre-select its project type, matching the incumbent behavior.
 */
export function useContactForm() {
  const [projectType, setProjectType] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<string | null>(null);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function onSelect(event: Event) {
      const type = (event as CustomEvent<string>).detail;
      if (PROJECT_TYPES.includes(type)) setProjectType(type);
    }
    window.addEventListener("service:select", onSelect);
    return () => window.removeEventListener("service:select", onSelect);
  }, []);

  async function submit(form: HTMLFormElement) {
    const fd = new FormData(form);
    const payload = {
      name: (fd.get("name") as string) || "",
      email: (fd.get("email") as string) || "",
      message: (fd.get("message") as string) || "",
      company: (fd.get("company") as string) || "", // honeypot
      projectType: projectType ?? "",
      timeline: timeline ?? "",
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
      setProjectType(null);
      setTimeline(null);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again."
      );
    }
  }

  return {
    projectType,
    setProjectType,
    timeline,
    setTimeline,
    status,
    setStatus,
    error,
    submit,
  };
}

/** Fire the same event Services rows on the homepage use to pre-select a type. */
export function selectService(type: string | null) {
  if (type) {
    window.dispatchEvent(new CustomEvent("service:select", { detail: type }));
  }
}
