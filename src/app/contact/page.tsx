import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { ContactForm } from "@/components/sections/ContactForm";
import { Reveal } from "@/components/ui/Reveal";
import { footprint, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Request a rate from CMB Cargo. Send us the commodity, route and deadline and the operations desk in Jebel Ali will come back with a costed option.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        lines={["Tell us what", "needs to move."]}
        standfirst="Commodity, origin, destination and the date it has to land. That is enough for us to come back with something real."
        image="/images/uae/dubai-night.jpg"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Contact", href: "/contact" },
        ]}
      />

      <section className="bay bg-ink" aria-labelledby="contact-heading">
        <div className="shell grid gap-16 lg:grid-cols-12 lg:gap-20">
          {/* ── Form ───────────────────────────────────────────────────── */}
          <div className="lg:col-span-7">
            <h2 id="contact-heading" className="text-d3 optic-wide text-sand">
              Send an enquiry
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-sand-dim">
              Fields marked * are required. If it is urgent, call the desk — it is staffed around
              the clock.
            </p>

            <div className="mt-12">
              <ContactForm />
            </div>
          </div>

          {/* ── Direct details ─────────────────────────────────────────── */}
          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <Reveal>
                <div className="rounded-sm border border-ink-line bg-ink-soft p-8">
                  <p className="eyebrow text-sand-mute">Direct</p>

                  <a
                    href={`tel:${site.contact.phoneHref}`}
                    className="mt-6 block font-display text-3xl optic-wide text-sand transition-colors hover:text-brass-hi"
                  >
                    {site.contact.phone}
                  </a>

                  <ul className="mt-7 flex flex-col gap-3 border-t border-ink-line pt-6">
                    <li>
                      <span className="eyebrow block text-sand-mute">General</span>
                      <a
                        href={`mailto:${site.contact.email}`}
                        className="mt-1.5 block text-sm text-sand transition-colors hover:text-brass-hi"
                      >
                        {site.contact.email}
                      </a>
                    </li>
                    <li>
                      <span className="eyebrow block text-sand-mute">Rates & quotes</span>
                      <a
                        href={`mailto:${site.contact.salesEmail}`}
                        className="mt-1.5 block text-sm text-sand transition-colors hover:text-brass-hi"
                      >
                        {site.contact.salesEmail}
                      </a>
                    </li>
                    <li>
                      <span className="eyebrow block text-sand-mute">WhatsApp</span>
                      <a
                        href={`https://wa.me/${site.contact.whatsappHref}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1.5 block text-sm text-sand transition-colors hover:text-brass-hi"
                      >
                        {site.contact.whatsapp}
                      </a>
                    </li>
                  </ul>

                  <div className="mt-7 border-t border-ink-line pt-6">
                    <span className="eyebrow block text-sand-mute">Head office</span>
                    <address className="mt-3 space-y-1 text-sm not-italic leading-relaxed text-sand-dim">
                      <p>{site.contact.address.line1}</p>
                      <p>{site.contact.address.line2}</p>
                      <p>
                        {site.contact.address.city}, {site.contact.address.country}
                      </p>
                      <p>{site.contact.address.poBox}</p>
                    </address>
                  </div>

                  <p className="mt-7 border-t border-ink-line pt-6 font-mono text-[0.625rem] uppercase leading-relaxed tracking-[0.16em] text-brass">
                    {site.contact.hours}
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="mt-8 rounded-sm border border-ink-line p-8">
                  <p className="eyebrow text-sand-mute">Offices</p>
                  <ul className="mt-5 flex flex-col gap-4">
                    {footprint.map((office) => (
                      <li key={office.city} className="flex items-baseline justify-between gap-4">
                        <span className="text-sm text-sand">{office.city}</span>
                        <span className="text-right text-xs text-sand-mute">{office.detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <p className="mt-6 font-mono text-[0.625rem] uppercase leading-relaxed tracking-[0.16em] text-sand-mute">
                Placeholder contact details — replace before launch.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
