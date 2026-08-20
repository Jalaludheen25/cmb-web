import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { services, site } from "@/lib/content";
import { pad } from "@/lib/utils";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) return {};

  return {
    title: service.title,
    description: service.short,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: `${service.title} — ${site.name}`,
      description: service.short,
      images: [{ url: service.image }],
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();

  // The next four services in sequence, wrapping around the list.
  //
  // Deliberately four rather than "all the others": the grid below draws its
  // hairlines with `gap-px` over a background, so any row that is not completely
  // filled leaves empty cells showing that background as pale rectangles. Four
  // divides evenly into both the 2- and 4-column layouts at every breakpoint,
  // and it stays correct however many services are added to the list.
  const currentIndex = services.findIndex((item) => item.slug === service.slug);
  const others = Array.from(
    { length: Math.min(4, services.length - 1) },
    (_, i) => services[(currentIndex + 1 + i) % services.length],
  );

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.short,
    provider: { "@type": "Organization", name: site.legalName, url: site.url },
    areaServed: "Worldwide",
    serviceType: service.title,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <PageHero
        eyebrow={`Service ${service.index}`}
        lines={[service.title]}
        standfirst={service.summary}
        image={service.image}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.title, href: `/services/${service.slug}` },
        ]}
      />

      {/* ── Intro + capability list ──────────────────────────────────── */}
      <section className="bay bg-ink" aria-labelledby="overview-heading">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <h2 id="overview-heading" className="text-d3 optic-wide text-sand">
                Overview
              </h2>
              <p className="mt-7 max-w-2xl text-lead text-sand-dim">{service.detail.intro}</p>
            </Reveal>

            <RevealGroup as="ul" className="mt-14 flex flex-col" stagger={0.08}>
              {service.detail.points.map((point, i) => (
                <RevealItem as="li" key={point.title} className="border-t border-ink-line py-8">
                  <div className="flex gap-6">
                    <span className="shrink-0 font-mono text-[0.625rem] tracking-[0.2em] text-brass">
                      {pad(i + 1)}
                    </span>
                    <div>
                      <h3 className="text-xl text-sand">{point.title}</h3>
                      <p className="mt-3 max-w-xl text-sm leading-relaxed text-sand-dim">
                        {point.body}
                      </p>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <div className="rounded-sm border border-ink-line bg-ink-soft p-8">
                <p className="eyebrow text-sand-mute">Capabilities</p>
                <ul className="mt-6 flex flex-col">
                  {service.capabilities.map((capability) => (
                    <li
                      key={capability}
                      className="flex items-start gap-3 border-b border-ink-line py-3.5 last:border-b-0 last:pb-0"
                    >
                      <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brass" />
                      <span className="text-sm text-sand-dim">{capability}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 rounded-sm border border-ink-line bg-deep p-8">
                <p className="eyebrow text-sand/60">Talk to the desk</p>
                <p className="mt-5 text-lg leading-snug text-sand">
                  Send us the commodity, the route and the deadline. We will come back with a
                  costed option, not a brochure.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button href="/contact" size="sm">
                    Request a rate
                  </Button>
                  <Button
                    href={`tel:${site.contact.phoneHref}`}
                    variant="outline"
                    size="sm"
                    arrow={false}
                  >
                    Call
                  </Button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ── Other services ────────────────────────────────────────────── */}
      <section className="bay bg-ink-soft" aria-labelledby="other-heading">
        <div className="shell">
          <Reveal>
            <div className="flex flex-wrap items-center justify-between gap-6">
              <h2 id="other-heading" className="text-d3 optic-wide text-sand">
                Other services
              </h2>
              <Button href="/services" variant="outline" size="sm">
                All {services.length} services
              </Button>
            </div>
          </Reveal>

          <RevealGroup as="ul" className="mt-10 grid gap-px overflow-hidden rounded-sm bg-ink-line sm:grid-cols-2 lg:grid-cols-4">
            {others.map((other) => (
              <RevealItem as="li" key={other.slug} className="bg-ink-soft">
                <Link
                  href={`/services/${other.slug}`}
                  data-cursor="link"
                  className="group/other flex h-full flex-col justify-between gap-8 p-7 transition-colors duration-500 hover:bg-ink"
                >
                  <span
                    aria-hidden="true"
                    className="font-mono text-[0.625rem] tracking-[0.2em] text-sand-mute transition-colors group-hover/other:text-brass"
                  >
                    {other.index}
                  </span>
                  <span>
                    <span className="block text-base leading-snug text-sand transition-colors group-hover/other:text-brass-hi">
                      {other.title}
                    </span>
                    <span className="mt-2 block text-xs leading-relaxed text-sand-mute">
                      {other.short}
                    </span>
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
    </>
  );
}
