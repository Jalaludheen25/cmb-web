"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { RotatingBackgroundVideo } from "@/components/ui/RotatingBackgroundVideo";
import { Button } from "@/components/ui/Button";
import { RevealText } from "@/components/ui/RevealText";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { hero, site } from "@/lib/content";

export function Hero() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // The media drifts slower than the page and dims as the section leaves —
  // it reads as the hero sinking behind the content rather than scrolling off.
  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-dvh flex-col justify-end overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <motion.div
        style={reduced ? undefined : { y: mediaY, scale: mediaScale }}
        className="absolute inset-0 -z-10"
      >
        <RotatingBackgroundVideo
          clips={hero.clips}
          poster={hero.poster}
          // Base tint under the vignette. The rotation runs from a bright
          // sunset departure through two night scenes, so the scrim has to hold
          // the standfirst legible across a wide swing in exposure.
          overlayClassName="media-scrim bg-ink/35"
        />
      </motion.div>

      {/* Extra floor gradient so the ticker rail always has contrast. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-gradient-to-t from-ink via-ink/85 to-transparent"
      />
      {/* Ceiling gradient — the header sits over whatever the footage is doing
          up there, and bright sky was washing the navigation out. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-48 bg-gradient-to-b from-ink/85 to-transparent"
      />

      <motion.div
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
        className="shell relative z-10 pt-32 pb-8"
      >
        {/* ── Locator strip ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center gap-x-5 gap-y-2"
        >
          <span className="relative flex h-2 w-2">
            <span
              aria-hidden="true"
              className="absolute inline-flex h-full w-full rounded-full bg-brass"
              style={{ animation: "pulse-ring 2.6s ease-out infinite" }}
            />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brass-hi" />
          </span>
          <p className="eyebrow text-sand">{hero.eyebrow}</p>
          <span aria-hidden="true" className="h-px w-8 bg-ink-line" />
          {/* sand-soft rather than sand-dim: this strip sits high in the frame
              where the floor scrim has not yet taken hold, and the footage is
              often bright sky behind it. */}
          <p className="eyebrow text-sand-soft">
            {site.contact.coordinates.lat.toFixed(4)}° N ·{" "}
            {site.contact.coordinates.lng.toFixed(4)}° E
          </p>
        </motion.div>

        {/* ── Headline ────────────────────────────────────────────────── */}
        <RevealText
          as="h1"
          lines={hero.headline}
          delay={0.28}
          stagger={0.11}
          className="mt-8 max-w-[18ch] text-mega optic-wide font-bold text-sand"
        />
        <span id="hero-heading" className="sr-only">
          {hero.headline.join(" ")}
        </span>

        {/* ── Standfirst + actions ────────────────────────────────────── */}
        <div className="mt-10 flex flex-col gap-9 border-t border-sand/15 pt-9 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.72, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl text-lead text-sand-soft"
          >
            {hero.standfirst}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.84, ease: [0.16, 1, 0.3, 1] }}
            className="flex shrink-0 flex-wrap items-center gap-4"
          >
            <Button href={hero.primaryCta.href} size="lg">
              {hero.primaryCta.label}
            </Button>
            <Button href={hero.secondaryCta.href} variant="outline" size="lg">
              {hero.secondaryCta.label}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Ticker rail ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="relative z-10 border-t border-sand/15 bg-ink/40 backdrop-blur-md"
      >
        <div className="shell flex items-stretch justify-between">
          <ul className="hide-scrollbar flex flex-1 items-center gap-8 overflow-x-auto py-5 sm:gap-14">
            {hero.ticker.map((item) => (
              <li key={item.label} className="flex shrink-0 items-baseline gap-3">
                <span className="font-mono text-[0.625rem] uppercase tracking-[0.22em] text-brass">
                  {item.label}
                </span>
                <span className="whitespace-nowrap text-sm text-sand-dim">{item.value}</span>
              </li>
            ))}
          </ul>

          <div
            aria-hidden="true"
            // pr-20 keeps the scroll cue clear of the floating WhatsApp button,
            // which is fixed 28px from the viewport edge and 56px wide — that
            // reaches 84px in, past where the shell gutter ends, so without
            // this the button clips the cue.
            className="ml-8 hidden shrink-0 items-center gap-3 border-l border-sand/15 pl-8 pr-20 md:flex"
          >
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.22em] text-sand-mute">
              Scroll
            </span>
            <span className="relative block h-8 w-px overflow-hidden bg-ink-line">
              <span
                className="absolute inset-x-0 top-0 block h-1/2 bg-brass"
                style={{ animation: "scroll-hint 2.2s ease-in-out infinite" }}
              />
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
