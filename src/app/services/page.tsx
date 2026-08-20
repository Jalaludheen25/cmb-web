import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Process } from "@/components/sections/Process";
import { services, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Sea freight, air freight, GCC land transport, bonded warehousing, customs clearance and project cargo — delivered from Dubai by a single accountable team.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Capability"
        lines={["Everything", "under one file."]}
        standfirst={`Eight disciplines run in-house, so a shipment never changes hands between companies that blame each other. ${site.name} owns the whole chain.`}
        image="/images/hero/hero-alt.jpg"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
        ]}
        meta={[
          { label: "Modes", value: "Sea · Air · Road" },
          { label: "Coverage", value: "120 markets" },
          { label: "Desk", value: "24 / 7 operations" },
        ]}
      />

      <section className="bay bg-ink" aria-label="Service index">
        <div className="shell">
          <ul className="flex flex-col">
            {services.map((service, i) => (
              <li key={service.slug}>
                <Reveal amount={0.15}>
                  <article
                    className={`grid items-center gap-8 border-t border-ink-line py-12 lg:grid-cols-12 lg:gap-14 lg:py-16 ${
                      i === services.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <div
                      className={`lg:col-span-5 ${i % 2 === 1 ? "lg:order-2" : ""}`}
                    >
                      <Link
                        href={`/services/${service.slug}`}
                        className="group/media relative block aspect-[4/3] w-full overflow-hidden rounded-sm"
                        tabIndex={-1}
                        aria-hidden="true"
                      >
                        <Image
                          src={service.image}
                          alt=""
                          fill
                          sizes="(max-width: 1024px) 100vw, 42vw"
                          className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/media:scale-[1.05]"
                        />
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent"
                        />
                      </Link>
                    </div>

                    <div className={`lg:col-span-7 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                      <p className="font-mono text-[0.6875rem] tracking-[0.2em] text-brass">
                        {service.index}
                      </p>
                      <h2 className="mt-4 text-d2 optic-wide text-sand">
                        <Link
                          href={`/services/${service.slug}`}
                          className="transition-colors hover:text-brass-hi"
                          data-cursor="link"
                        >
                          {service.title}
                        </Link>
                      </h2>
                      <p className="mt-5 max-w-xl text-lead text-sand-dim">{service.summary}</p>

                      <ul className="mt-7 flex flex-wrap gap-2">
                        {service.capabilities.map((capability) => (
                          <li
                            key={capability}
                            className="rounded-full border border-ink-line px-3.5 py-1.5 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-sand-dim"
                          >
                            {capability}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-9">
                        <Button href={`/services/${service.slug}`} variant="outline" size="sm">
                          {service.title} detail
                        </Button>
                      </div>
                    </div>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Process />
    </>
  );
}
