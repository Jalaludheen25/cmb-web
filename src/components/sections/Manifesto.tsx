import Image from "next/image";
import { ScrollWords } from "@/components/ui/ScrollWords";
import { Parallax } from "@/components/ui/Parallax";
import { Reveal } from "@/components/ui/Reveal";
import { manifesto, site } from "@/lib/content";

/**
 * The positioning statement.
 *
 * One long sentence at display size, illuminated word-by-word as the reader
 * scrolls — the page's single most deliberate piece of pacing, which is why the
 * technique appears exactly once.
 */
export function Manifesto() {
  return (
    <section className="bay relative overflow-hidden bg-ink" aria-labelledby="manifesto-heading">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            <Reveal>
              <p className="eyebrow flex items-center gap-3 text-sand-dim">
                <span aria-hidden="true" className="inline-block h-px w-8 bg-brass" />
                {manifesto.eyebrow}
              </p>
            </Reveal>

            <h2 id="manifesto-heading" className="sr-only">
              What {site.name} is
            </h2>

            <ScrollWords
              text={manifesto.body}
              className="mt-10 max-w-[24ch] font-display text-d3 optic-narrow font-medium leading-[1.18] text-sand sm:max-w-[30ch]"
            />

            <Reveal delay={0.1}>
              <p className="mt-10 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-brass">
                {manifesto.signature}
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-4">
            <Parallax speed={0.1} className="relative aspect-[3/4] w-full rounded-sm">
              <Image
                src="/images/editorial/mono-ship.jpg"
                alt="A container vessel alongside, seen from the quay."
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover grayscale-[0.35]"
              />
            </Parallax>

            <Reveal delay={0.15}>
              <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-ink-line pt-8">
                <div>
                  <dt className="eyebrow text-sand-mute">Established</dt>
                  <dd className="mt-2 font-display text-3xl optic-wide text-sand">
                    {site.founded}
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-sand-mute">Head office</dt>
                  <dd className="mt-2 font-display text-3xl optic-wide text-sand">Dubai</dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
