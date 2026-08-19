"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { process } from "@/lib/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * How a shipment actually runs.
 *
 * A sticky masthead on the left, the five stages on the right, and a brass rail
 * that fills in step with scroll position — the reader's progress through the
 * list and the cargo's progress through the process are the same gesture.
 */
export function Process() {
  const reduced = useReducedMotion();
  const railRef = useRef<HTMLOListElement>(null);

  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 0.75", "end 0.85"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <section className="bay bg-ink-soft" aria-labelledby="process-heading">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <SectionHeading
                eyebrow="How it runs"
                lines={["Five stages.", "One owner."]}
                standfirst="Every shipment passes the same five gates. What changes is the detail inside them — never who is accountable."
                as="h2"
              />
              <span id="process-heading" className="sr-only">
                Our process
              </span>
              <Reveal delay={0.15}>
                <div className="mt-10">
                  <Button href="/contact" variant="outline">
                    Start a shipment
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ol ref={railRef} className="relative pl-10 sm:pl-14">
              {/* Rail track */}
              <span
                aria-hidden="true"
                className="absolute left-[0.4375rem] top-2 bottom-2 w-px bg-ink-line sm:left-[0.6875rem]"
              />
              {/* Rail fill */}
              <motion.span
                aria-hidden="true"
                style={reduced ? { scaleY: 1 } : { scaleY }}
                className="absolute left-[0.4375rem] top-2 bottom-2 w-px origin-top bg-brass sm:left-[0.6875rem]"
              />

              {process.map((stage, i) => (
                <li key={stage.step} className="relative pb-12 last:pb-0">
                  <Reveal delay={i * 0.04}>
                    <span
                      aria-hidden="true"
                      className="absolute -left-10 top-1.5 grid h-4 w-4 place-items-center rounded-full border border-ink-line bg-ink-soft sm:-left-14 sm:h-6 sm:w-6"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-brass" />
                    </span>

                    <p className="font-mono text-[0.625rem] uppercase tracking-[0.22em] text-brass">
                      Stage {stage.step}
                    </p>
                    <h3 className="mt-3 text-d3 optic-wide text-sand">{stage.title}</h3>
                    <p className="mt-3 max-w-lg text-sm leading-relaxed text-sand-dim">
                      {stage.body}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
