import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/sections/PageHero";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Parallax } from "@/components/ui/Parallax";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stats } from "@/components/sections/Stats";
import { about, certifications, footprint, site } from "@/lib/content";
import { pad } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description:
    "CMB Cargo is a Dubai-based freight forwarder and contract logistics provider, run by people who came off the operations floor rather than out of a sales deck.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={about.eyebrow}
        lines={about.headline}
        standfirst={about.lead}
        image="/images/editorial/about-wide.jpg"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
        ]}
        meta={[
          { label: "Founded", value: String(site.founded) },
          { label: "Head office", value: "Jebel Ali, Dubai" },
          { label: "Offices", value: `${footprint.length} in the UAE` },
        ]}
      />

      {/* ── Story ─────────────────────────────────────────────────────── */}
      <section className="bay bg-ink" aria-labelledby="story-heading">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Parallax speed={0.1} className="relative aspect-[3/4] w-full rounded-sm">
              <Image
                src="/images/editorial/team-trolley.jpg"
                alt="Warehouse team moving palletised goods across a distribution floor."
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </Parallax>
          </div>

          <div className="lg:col-span-7">
            <h2 id="story-heading" className="eyebrow flex items-center gap-3 text-sand-dim">
              <span aria-hidden="true" className="inline-block h-px w-8 bg-brass" />
              The company
            </h2>
            <div className="mt-10 flex flex-col gap-7">
              {about.body.map((paragraph, i) => (
                <Reveal key={paragraph} delay={i * 0.05}>
                  <p className="max-w-2xl text-lead text-sand-dim">{paragraph}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2}>
              <div className="mt-12 grid gap-6 border-t border-ink-line pt-10 sm:grid-cols-2">
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                  <Image
                    src="/images/editorial/team-collab.jpg"
                    alt="Two colleagues reviewing a shipment plan on the warehouse floor."
                    fill
                    sizes="(max-width: 640px) 100vw, 30vw"
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                  <Image
                    src="/images/uae/dubai-desert.jpg"
                    alt="The Dubai skyline meeting open desert."
                    fill
                    sizes="(max-width: 640px) 100vw, 30vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Values ────────────────────────────────────────────────────── */}
      <section className="bay bg-ink-soft" aria-labelledby="values-heading">
        <div className="shell">
          <SectionHeading
            eyebrow="How we work"
            lines={["Four habits", "we do not trade."]}
            standfirst="Not values in the poster sense. These are the four things we will not quietly drop when a week gets difficult."
            as="h2"
          />
          <span id="values-heading" className="sr-only">
            How we work
          </span>

          <RevealGroup
            as="ul"
            stagger={0.08}
            className="mt-16 grid gap-px overflow-hidden rounded-sm bg-ink-line sm:grid-cols-2"
          >
            {about.values.map((value, i) => (
              <RevealItem as="li" key={value.title} className="bg-ink-soft p-8 lg:p-10">
                <span className="font-mono text-[0.625rem] tracking-[0.2em] text-brass">
                  {pad(i + 1)}
                </span>
                <h3 className="mt-6 text-d3 optic-wide text-sand">{value.title}</h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-sand-dim">{value.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <Stats />

      {/* ── Footprint + accreditation ────────────────────────────────── */}
      <section className="bay bg-ink" aria-labelledby="footprint-heading">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Footprint"
              lines={["Where we", "actually are."]}
              as="h2"
            />
            <span id="footprint-heading" className="sr-only">
              Our footprint
            </span>
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-md text-sm leading-relaxed text-sand-dim">
                Three UAE locations, each with its own operational focus, plus a vetted agency
                network covering the lanes we do not staff ourselves.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <RevealGroup as="ul" className="flex flex-col" stagger={0.08}>
              {footprint.map((office, i) => (
                <RevealItem as="li" key={office.city} className="border-t border-ink-line py-7 last:border-b">
                  <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
                    <span className="font-mono text-[0.625rem] tracking-[0.2em] text-brass">
                      {pad(i + 1)}
                    </span>
                    <h3 className="text-d3 optic-wide text-sand">{office.city}</h3>
                    <span className="ml-auto text-sm text-sand-dim">{office.role}</span>
                  </div>
                  <p className="mt-2 pl-12 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-sand-mute">
                    {office.detail}
                  </p>
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal delay={0.15}>
              <div className="mt-12">
                <p className="eyebrow text-sand-mute">Accreditations</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {certifications.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-ink-line px-4 py-2 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-sand-dim"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-sand-mute">
                  Placeholder list — publish only credentials actually held.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
