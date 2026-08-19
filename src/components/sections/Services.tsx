"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { services } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Service index.
 *
 * Desktop pairs a sticky image stage with a list of rows; pointing at (or
 * tabbing to) a row crossfades the stage. Below `lg` the stage is dropped
 * entirely and each row carries its own thumbnail — a hover-driven panel has
 * nothing to say on a touch device, so it is not rendered there at all.
 */
export function Services() {
  const [active, setActive] = useState(0);

  return (
    <section id="services" className="bay relative bg-ink-soft" aria-labelledby="services-heading">
      <div className="shell">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="What we do"
            lines={["Six disciplines,", "one file owner."]}
            standfirst="Freight forwarding is only as good as the handovers inside it. We run all six in-house so there are none."
            as="h2"
            headingClassName="text-d2"
          />
          <div className="shrink-0 lg:pb-3">
            <Button href="/services" variant="outline">
              All services
            </Button>
          </div>
        </div>
        <span id="services-heading" className="sr-only">
          Our services
        </span>

        <div className="mt-16 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-14">
          {/* ── Sticky image stage (desktop only) ───────────────────────── */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-28">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-ink">
                {services.map((service, i) => (
                  <motion.div
                    key={service.slug}
                    initial={false}
                    animate={{
                      opacity: active === i ? 1 : 0,
                      scale: active === i ? 1 : 1.06,
                    }}
                    transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={service.image}
                      alt=""
                      fill
                      sizes="40vw"
                      className="object-cover"
                    />
                  </motion.div>
                ))}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent"
                />
                <div className="grain-layer" />

                <div className="absolute inset-x-0 bottom-0 z-10 p-7">
                  <motion.p
                    key={services[active].slug}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="text-sm leading-relaxed text-sand-soft"
                  >
                    {services[active].summary}
                  </motion.p>
                </div>
              </div>

              {/* Capability chips for the focused service. */}
              <motion.ul
                key={`caps-${services[active].slug}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mt-6 flex flex-wrap gap-2"
              >
                {services[active].capabilities.slice(0, 4).map((capability) => (
                  <li
                    key={capability}
                    className="rounded-full border border-ink-line px-3 py-1.5 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-sand-dim"
                  >
                    {capability}
                  </li>
                ))}
              </motion.ul>
            </div>
          </div>

          {/* ── Row list ────────────────────────────────────────────────── */}
          <ul className="lg:col-span-7">
            {services.map((service, i) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  data-cursor="link"
                  className={cn(
                    "group/row block border-t border-ink-line py-7 transition-colors duration-500",
                    "last:border-b lg:py-8",
                    active === i ? "border-t-brass/40" : "",
                  )}
                >
                  <div className="flex items-start gap-5 sm:gap-8">
                    <span
                      className={cn(
                        "mt-1 shrink-0 font-mono text-[0.6875rem] tracking-[0.16em] transition-colors duration-400",
                        active === i ? "text-brass" : "text-sand-mute",
                      )}
                    >
                      {service.index}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-4">
                        <h3
                          className={cn(
                            "text-d3 optic-wide transition-colors duration-400",
                            active === i ? "text-brass-hi" : "text-sand",
                          )}
                        >
                          {service.title}
                        </h3>
                        <span
                          aria-hidden="true"
                          className="hidden h-px flex-1 origin-left scale-x-0 bg-brass/50 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/row:scale-x-100 sm:block"
                        />
                      </div>

                      <p className="mt-3 max-w-lg text-sm leading-relaxed text-sand-dim">
                        {service.short}
                      </p>

                      {/* Row thumbnail — replaces the sticky stage below lg. */}
                      <div className="relative mt-5 aspect-[16/9] w-full overflow-hidden rounded-sm lg:hidden">
                        <Image
                          src={service.image}
                          alt=""
                          fill
                          sizes="100vw"
                          className="object-cover"
                        />
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent"
                        />
                      </div>
                    </div>

                    <span
                      aria-hidden="true"
                      className={cn(
                        "mt-1 shrink-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        "group-hover/row:translate-x-1 group-hover/row:text-brass-hi",
                        active === i ? "text-brass" : "text-sand-mute",
                      )}
                    >
                      <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
                        <path
                          d="M3 13 13 3M6 3h7v7"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
