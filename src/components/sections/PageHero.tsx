import Image from "next/image";
import Link from "next/link";
import { RevealText } from "@/components/ui/RevealText";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Interior-page masthead.
 *
 * Shorter than the home hero (it opens a page rather than a site) but built on
 * the same grammar: eyebrow, mask-revealed display lines, standfirst, and a
 * dimmed photographic ground.
 */
export function PageHero({
  eyebrow,
  lines,
  standfirst,
  image,
  imageAlt = "",
  breadcrumb,
  meta,
}: {
  eyebrow: string;
  lines: readonly string[];
  standfirst?: string;
  image: string;
  imageAlt?: string;
  breadcrumb?: { label: string; href: string }[];
  meta?: { label: string; value: string }[];
}) {
  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />
      {/* Scrim budget.
          Three layers, each with one job, rather than one full-height ramp that
          was 100% opaque at the base and still 35% at the middle — that put a
          hard black band across the bottom of every interior hero and dulled
          the artwork throughout.

          How light this can go is set by the *brightest* hero image, not the
          darkest. `about-wide.jpg` averages Y≈183 raw; a scrim loose enough to
          make the dark `dubai-night.jpg` sparkle would drop the About standfirst
          below AA. So these values are tuned to land the brightest page around
          6:1 at the p90 background, which is where the home hero sits.
          Re-measure with `npm run heroscrim` after touching any of them. */}

      {/* Overall tint. Held near its original strength on purpose: the
          breadcrumb and eyebrow sit in the *middle* of the plate, where neither
          gradient reaches, so this is the only thing carrying them. Dropping it
          to lighten the picture washed both of them out. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink/44" />

      {/* Ceiling — the header sits here and needs a reliable ground. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-gradient-to-b from-ink/62 to-transparent"
      />

      {/* Floor. This is the layer the brief was about. It replaces a
          full-height ramp that was 100% opaque at the base and still 35% at the
          midpoint — a hard black band across the bottom of every interior hero.
          Now the darkening is confined to the lower three-quarters and stays
          light through it, reaching full opacity only at the very base so the
          hero still hands off cleanly to the ink section below. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-gradient-to-t from-ink via-ink/40 to-transparent"
      />
      <div className="grain-layer" />

      <div className="shell relative z-10 pt-36 pb-16 md:pt-48 md:pb-20">
        {breadcrumb && (
          <Reveal duration={0.6}>
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2">
                {breadcrumb.map((crumb, i) => (
                  <li key={crumb.href} className="flex items-center gap-2">
                    {i > 0 && (
                      <span aria-hidden="true" className="text-sand-dim">
                        /
                      </span>
                    )}
                    <Link
                      href={crumb.href}
                      className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-sand transition-colors hover:text-brass-hi"
                    >
                      {crumb.label}
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>
          </Reveal>
        )}

        <Reveal duration={0.7} delay={0.05}>
          <p className="eyebrow mt-6 flex items-center gap-3 text-sand">
            <span aria-hidden="true" className="inline-block h-px w-8 bg-brass" />
            {eyebrow}
          </p>
        </Reveal>

        <RevealText
          as="h1"
          lines={lines}
          delay={0.12}
          className="mt-7 max-w-[16ch] text-d1 optic-wide font-bold text-sand"
        />

        {standfirst && (
          <Reveal delay={0.25}>
            <p className="mt-8 max-w-2xl text-lead text-sand-soft">{standfirst}</p>
          </Reveal>
        )}

        {meta && (
          <Reveal delay={0.3}>
            <dl className="mt-12 flex flex-wrap gap-x-12 gap-y-6 border-t border-sand/15 pt-8">
              {meta.map((item) => (
                <div key={item.label}>
                  <dt className="eyebrow text-sand-dim">{item.label}</dt>
                  <dd className="mt-2 text-sm text-sand">{item.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        )}
      </div>
    </section>
  );
}
