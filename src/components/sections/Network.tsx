"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { corridors, hub } from "@/lib/content";
import { cn, pad } from "@/lib/utils";

/**
 * The globe is the heaviest thing on the page, so it is code-split and never
 * server-rendered. Until it arrives the section shows a static ring placeholder
 * that occupies the identical box — no layout shift, and the corridor list
 * beside it is fully usable on its own.
 */
const Globe = dynamic(() => import("@/components/three/Globe"), {
  ssr: false,
  loading: () => <GlobePlaceholder />,
});

export function Network() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="network" className="bay relative overflow-hidden bg-ink" aria-labelledby="network-heading">
      {/* Faint horizon glow behind the globe */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[60rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.07] blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-brass) 0%, transparent 62%)" }}
      />

      <div className="shell relative z-10">
        <SectionHeading
          eyebrow="The network"
          lines={["One hub.", "Every direction."]}
          standfirst={`Jebel Ali sits within eight hours' flying of two-thirds of the world's population. We treat that as an operating advantage, not a slogan.`}
          as="h2"
        />
        <span id="network-heading" className="sr-only">
          Our network
        </span>

        <div className="mt-16 grid items-center gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          {/* ── Corridor list ───────────────────────────────────────────── */}
          <div className="lg:col-span-5">
            <Reveal>
              <div className="flex items-center gap-3 border-b border-ink-line pb-4">
                <span className="h-2 w-2 rounded-full bg-brass-hi" />
                <p className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-sand">
                  {hub.name}, {hub.country}
                </p>
                <span className="ml-auto font-mono text-[0.625rem] uppercase tracking-[0.16em] text-sand-mute">
                  Hub
                </span>
              </div>
            </Reveal>

            <ul
              className="mt-1"
              onMouseLeave={() => setActive(null)}
            >
              {corridors.map((corridor, i) => (
                <li key={corridor.name}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onBlur={() => setActive(null)}
                    aria-pressed={active === i}
                    className={cn(
                      "group/lane flex w-full items-baseline gap-4 border-b border-ink-line/70 py-3.5 text-left transition-colors duration-400",
                      active === i ? "text-brass-hi" : "text-sand hover:text-brass-hi",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "shrink-0 font-mono text-[0.625rem] tracking-[0.16em] transition-colors",
                        active === i ? "text-brass" : "text-sand-mute",
                      )}
                    >
                      {pad(i + 1)}
                    </span>
                    <span className="flex-1 truncate text-base">{corridor.name}</span>
                    <span className="hidden shrink-0 text-xs text-sand-mute sm:block">
                      {corridor.country}
                    </span>
                    <span
                      className={cn(
                        "shrink-0 font-mono text-[0.5625rem] uppercase tracking-[0.16em] transition-colors",
                        active === i ? "text-brass" : "text-sand-mute",
                      )}
                    >
                      {corridor.mode}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <Reveal delay={0.1}>
              <p className="mt-6 text-xs leading-relaxed text-sand-mute">
                Principal lanes shown. Agency coverage extends to 120 markets — ask us about
                anything not listed.
              </p>
            </Reveal>
          </div>

          {/* ── Globe ───────────────────────────────────────────────────── */}
          <div className="lg:col-span-7">
            <div className="relative mx-auto aspect-square w-full max-w-[36rem]">
              <Globe activeIndex={active} />

              {/* Read-out overlay for the focused lane */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center">
                <div
                  className={cn(
                    "rounded-full border border-ink-line bg-ink/80 px-5 py-2.5 backdrop-blur-md transition-opacity duration-400",
                    active === null ? "opacity-0" : "opacity-100",
                  )}
                >
                  <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-sand">
                    {hub.name}
                    <span className="mx-2 text-brass">→</span>
                    {active === null ? "—" : corridors[active].name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GlobePlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
      <div className="relative h-3/4 w-3/4">
        <div className="absolute inset-0 rounded-full border border-ink-line" />
        <div className="absolute inset-[12%] rounded-full border border-ink-line/60" />
        <div className="absolute inset-[28%] rounded-full border border-ink-line/40" />
        <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brass" />
      </div>
    </div>
  );
}
