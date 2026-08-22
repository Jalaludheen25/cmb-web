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
          // Base tint under the vignette, kept light: the floor gradient below
          // does the legibility work where the text actually sits, so this only
          // needs to take the edge off the brightest frames.
          overlayClassName="media-scrim bg-ink/22"
        />
      </motion.div>

      {/* Floor gradient — the only layer that has to guarantee contrast for the
          standfirst and the ticker rail.

          Deliberately breakpoint-aware, because the standfirst sits at a very
          different height in the frame: ~79% down on desktop, but ~57% on a
          phone, where the hero content fills far more of the viewport. A single
          `h-1/2` ramp contributes ~43% of its strength at the desktop position
          and only ~5% at the mobile one — measured, the phone standfirst fell
          to 2.8:1 against the bright bridge while desktop sat at 7.3:1.

          So mobile gets a taller, stronger ramp and everything from `md` up
          gets the light treatment. Both now clear AA with headroom. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-gradient-to-t from-ink/90 via-ink/58 to-transparent md:h-1/2 md:from-ink/88 md:via-ink/18"
      />
      {/* Ceiling gradient — carries the header, and the locator strip beneath it.

          Sized as a percentage, not a fixed height, because the content is
          bottom-aligned: the locator strip lands at 22% of the hero on desktop
          and 26% on mobile, but 45% on a tall tablet viewport. A 384px ramp
          covered the first two and left the tablet strip in a dead zone between
          this and the floor, measuring 2.5:1. At 70% the two layers overlap and
          there is no gap at any viewport height. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[70%] bg-gradient-to-b from-ink/85 to-transparent"
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
          {/* Full-strength sand, matching the eyebrow beside it. This strip sits
              where neither scrim is at full strength and the footage behind it
              is often bright sky, so the dimmer greys measured below AA here. */}
          <p className="eyebrow text-sand">
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
