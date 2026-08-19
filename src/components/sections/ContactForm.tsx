"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { enquiryTypes, site } from "@/lib/content";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<"name" | "email" | "message" | "enquiry" | "form", string>>;

const fieldClass =
  "w-full rounded-none border-0 border-b border-ink-line bg-transparent px-0 py-3.5 " +
  "text-sand placeholder:text-sand-mute transition-colors duration-300 " +
  "focus:border-brass focus:outline-none focus:ring-0";

const labelClass = "eyebrow block text-sand-mute";

export function ContactForm() {
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    // Mirror the server rules so the common mistakes never cost a round trip.
    const next: Errors = {};
    const name = String(data.name ?? "").trim();
    const email = String(data.email ?? "").trim();
    const message = String(data.message ?? "").trim();

    if (name.length < 2) next.name = "Please give us a name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      next.email = "That email address does not look right.";
    }
    if (message.length < 10) next.message = "A little more detail, please.";

    setErrors(next);
    if (Object.keys(next).length > 0) {
      // Move the user to the first problem rather than making them hunt.
      const firstKey = Object.keys(next)[0];
      form.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        errors?: Errors;
      };

      if (!response.ok) {
        setErrors(payload.errors ?? { form: payload.error ?? "Something went wrong." });
        setStatus("error");
        return;
      }

      form.reset();
      setStatus("sent");
    } catch {
      setErrors({
        form: "We could not reach the server. Please email or call us directly.",
      });
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
      {/* Honeypot — visually and programmatically hidden from real users. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-website`}>Leave this empty</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <Field
          id={`${id}-name`}
          name="name"
          label="Name *"
          autoComplete="name"
          error={errors.name}
          placeholder="Your full name"
        />
        <Field
          id={`${id}-company`}
          name="company"
          label="Company"
          autoComplete="organization"
          placeholder="Optional"
        />
        <Field
          id={`${id}-email`}
          name="email"
          type="email"
          label="Email *"
          autoComplete="email"
          error={errors.email}
          placeholder="you@company.com"
        />
        <Field
          id={`${id}-phone`}
          name="phone"
          type="tel"
          label="Phone"
          autoComplete="tel"
          placeholder="Optional"
        />
      </div>

      <div>
        <label htmlFor={`${id}-enquiry`} className={labelClass}>
          What is it about?
        </label>
        <select
          id={`${id}-enquiry`}
          name="enquiry"
          defaultValue={enquiryTypes[0]}
          className={cn(fieldClass, "cursor-pointer appearance-none")}
        >
          {enquiryTypes.map((type) => (
            <option key={type} value={type} className="bg-ink text-sand">
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${id}-message`} className={labelClass}>
          Details *
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={5}
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${id}-message-error` : undefined}
          placeholder="Commodity, origin and destination, rough volumes, and the date it needs to land."
          className={cn(fieldClass, "resize-y", errors.message && "border-red-400/70")}
        />
        {errors.message && (
          <p id={`${id}-message-error`} className="mt-2 text-xs text-red-300">
            {errors.message}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <Button type="submit" size="lg" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send enquiry"}
        </Button>
        <p className="text-xs text-sand-mute">
          Or email{" "}
          <a
            href={`mailto:${site.contact.salesEmail}`}
            className="link-wipe text-sand transition-colors hover:text-brass-hi"
          >
            {site.contact.salesEmail}
          </a>
        </p>
      </div>

      {/* Live region so status changes are announced, not just shown. */}
      <div aria-live="polite" className="min-h-6">
        <AnimatePresence mode="wait">
          {status === "sent" && (
            <motion.p
              key="sent"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-sm border border-brass/40 bg-brass/10 px-5 py-4 text-sm text-brass-hi"
            >
              Thank you — that is with the desk. You will hear back within one working day.
            </motion.p>
          )}
          {status === "error" && errors.form && (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-sm border border-red-400/40 bg-red-400/10 px-5 py-4 text-sm text-red-200"
            >
              {errors.form}{" "}
              <a
                href={`tel:${site.contact.phoneHref}`}
                className="underline underline-offset-4 hover:text-sand"
              >
                {site.contact.phone}
              </a>
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  autoComplete,
  placeholder,
  error,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(fieldClass, error && "border-red-400/70")}
      />
      {error && (
        <p id={`${id}-error`} className="mt-2 text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
