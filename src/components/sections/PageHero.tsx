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
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink/80" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/40 to-ink/70"
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
                      <span aria-hidden="true" className="text-sand-mute">
                        /
                      </span>
                    )}
                    <Link
                      href={crumb.href}
                      className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-sand-dim transition-colors hover:text-brass-hi"
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
          <p className="eyebrow mt-6 flex items-center gap-3 text-brass">
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
                  <dt className="eyebrow text-sand-mute">{item.label}</dt>
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
