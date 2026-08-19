"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Reveal } from "@/components/ui/Reveal";
import { testimonials } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Client voice.
 *
 * The only block on the home page rendered at full width in Gulf green, which
 * is what makes it land as a change of register rather than another dark band.
 * Quotes crossfade under explicit control — nothing auto-advances, because a
 * quote that moves while you are reading it is worse than no quote.
 */
export function Testimonials() {
  const [index, setIndex] = useState(0);
  const current = testimonials[index];

  return (
    <section className="relative overflow-hidden bg-deep" aria-labelledby="testimonials-heading">
      <div className="grain-layer" />

      <div className="shell relative z-10 bay">
        <h2 id="testimonials-heading" className="sr-only">
          What clients say
        </h2>

        <Reveal>
          <p className="eyebrow flex items-center gap-3 text-sand/60">
            <span aria-hidden="true" className="inline-block h-px w-8 bg-brass" />
            In their words
          </p>
        </Reveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.figure
                key={index}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <blockquote>
                  <p className="font-display text-d3 optic-narrow font-medium leading-[1.22] text-sand">
                    <span aria-hidden="true" className="text-brass">
                      “
                    </span>
                    {current.quote}
                    <span aria-hidden="true" className="text-brass">
                      ”
                    </span>
                  </p>
                </blockquote>
                <figcaption className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="text-sm text-sand">{current.name}</span>
                  <span aria-hidden="true" className="h-3 w-px bg-sand/30" />
                  <span className="text-sm text-sand/70">{current.role}</span>
                  <span aria-hidden="true" className="h-3 w-px bg-sand/30" />
                  <span className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-brass">
                    {current.company}
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="flex items-end lg:col-span-3 lg:justify-end">
            <div className="flex items-center gap-3">
              {testimonials.map((testimonial, i) => (
                <button
                  key={testimonial.company + i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show quote ${i + 1} of ${testimonials.length}`}
                  aria-current={index === i}
                  className={cn(
                    "h-2 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    index === i ? "w-10 bg-brass" : "w-2 bg-sand/30 hover:bg-sand/60",
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        <Reveal delay={0.1}>
          <p className="mt-14 border-t border-sand/15 pt-6 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-sand/45">
            Placeholder quotes — replace with attributed client testimonials before launch.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
