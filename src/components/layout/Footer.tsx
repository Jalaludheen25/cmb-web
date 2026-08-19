"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { certifications, navigation, services, site } from "@/lib/content";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-ink-line bg-ink-soft">
      <div className="grain-layer" />

      <div className="shell relative z-10 pt-20 pb-10 md:pt-28">
        {/* ── Closing call to action ─────────────────────────────────────── */}
        <Reveal>
          <div className="flex flex-col gap-8 border-b border-ink-line pb-14 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow text-sand-mute">Next step</p>
              <h2 className="mt-5 max-w-2xl text-d2 optic-wide text-sand">
                Tell us what needs to move.
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button href="/contact" size="lg">
                Request a rate
              </Button>
              <Button href={`tel:${site.contact.phoneHref}`} variant="outline" size="lg" arrow={false}>
                {site.contact.phone}
              </Button>
            </div>
          </div>
        </Reveal>

        {/* ── Link columns ──────────────────────────────────────────────── */}
        <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo className="text-sand" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-sand-dim">
              {site.description}
            </p>
            <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
              {site.social.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link-wipe font-mono text-[0.625rem] uppercase tracking-[0.2em] text-sand-dim transition-colors hover:text-brass-hi"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Services" className="lg:col-span-3">
            <p className="eyebrow text-sand-mute">Services</p>
            <ul className="mt-6 space-y-3">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-sm text-sand-dim transition-colors hover:text-brass-hi"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company" className="lg:col-span-2">
            <p className="eyebrow text-sand-mute">Company</p>
            <ul className="mt-6 space-y-3">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-sand-dim transition-colors hover:text-brass-hi"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <p className="eyebrow text-sand-mute">Head office</p>
            <address className="mt-6 space-y-1 text-sm not-italic leading-relaxed text-sand-dim">
              <p>{site.contact.address.line1}</p>
              <p>{site.contact.address.line2}</p>
              <p>
                {site.contact.address.city}, {site.contact.address.country}
              </p>
              <p>{site.contact.address.poBox}</p>
            </address>
            <div className="mt-5 space-y-1 text-sm">
              <a
                href={`tel:${site.contact.phoneHref}`}
                className="block text-sand transition-colors hover:text-brass-hi"
              >
                {site.contact.phone}
              </a>
              <a
                href={`mailto:${site.contact.email}`}
                className="block text-sand transition-colors hover:text-brass-hi"
              >
                {site.contact.email}
              </a>
            </div>
            <p className="mt-5 font-mono text-[0.625rem] uppercase leading-relaxed tracking-[0.14em] text-sand-mute">
              {site.contact.hours}
            </p>
          </div>
        </div>

        {/* ── Accreditations ────────────────────────────────────────────── */}
        <ul className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-ink-line py-7">
          {certifications.map((item) => (
            <li
              key={item}
              className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-sand-mute"
            >
              {item}
            </li>
          ))}
        </ul>

        {/* ── Oversized wordmark ────────────────────────────────────────── */}
        <div aria-hidden="true" className="select-none pt-6 pb-4">
          <p className="text-mega optic-wide font-display font-bold leading-none text-transparent [-webkit-text-stroke:1px_var(--color-ink-line)]">
            CMB CARGO
          </p>
        </div>

        {/* ── Legal bar ─────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 border-t border-ink-line pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-sand-mute">
            © {year} {site.legalName}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {["Privacy", "Terms", "Trading conditions"].map((item) => (
              <li key={item}>
                <Link
                  href="/contact"
                  className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-sand-mute transition-colors hover:text-brass-hi"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
