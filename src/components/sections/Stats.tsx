import Image from "next/image";
import { Counter } from "@/components/ui/Counter";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { stats } from "@/lib/content";

/**
 * Scale band.
 *
 * Full-bleed imagery pushed well back behind a heavy scrim, so the numbers
 * carry the section and the photograph only supplies atmosphere.
 */
export function Stats() {
  return (
    <section className="relative isolate overflow-hidden" aria-labelledby="stats-heading">
      <Image
        src="/images/uae/dubai-dusk.jpg"
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink/88" />
      <div className="grain-layer" />

      <div className="shell relative z-10 bay">
        <h2 id="stats-heading" className="sr-only">
          CMB Cargo by the numbers
        </h2>

        <Reveal>
          <p className="eyebrow flex items-center gap-3 text-sand-dim">
            <span aria-hidden="true" className="inline-block h-px w-8 bg-brass" />
            By the numbers
          </p>
        </Reveal>

        <RevealGroup
          as="ul"
          stagger={0.12}
          className="mt-14 grid gap-px overflow-hidden rounded-sm bg-ink-line sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <RevealItem as="li" key={stat.label} className="bg-ink/70 p-8 backdrop-blur-sm lg:p-9">
              <p className="flex items-baseline font-display text-6xl optic-wide font-bold leading-none text-sand lg:text-7xl">
                <Counter value={stat.value} className="tabular-nums" />
                <span className="ml-1 text-brass">{stat.suffix}</span>
              </p>
              <p className="mt-6 text-sm leading-snug text-sand">{stat.label}</p>
              <p className="mt-2 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-sand-mute">
                {stat.detail}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1}>
          <p className="mt-8 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-sand-mute">
            Figures are indicative and pending client verification.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
