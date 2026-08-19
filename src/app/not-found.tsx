import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { services } from "@/lib/content";

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-dvh items-center overflow-hidden">
      <Image
        src="/images/hero/hero-mono.jpg"
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover opacity-40"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink/85" />
      <div className="grain-layer" />

      <div className="shell relative z-10 py-32">
        <p className="eyebrow flex items-center gap-3 text-brass">
          <span aria-hidden="true" className="inline-block h-px w-8 bg-brass" />
          Error 404
        </p>

        <h1 className="mt-8 max-w-[14ch] text-d1 optic-wide font-bold text-sand">
          This one went astray.
        </h1>

        <p className="mt-7 max-w-lg text-lead text-sand-dim">
          The page you asked for is not at this address. Unlike your cargo, we cannot tell you
          exactly where it went — but here is the way back.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Button href="/" size="lg">
            Back to home
          </Button>
          <Button href="/contact" variant="outline" size="lg">
            Contact the desk
          </Button>
        </div>

        <nav aria-label="Services" className="mt-16 border-t border-ink-line pt-8">
          <p className="eyebrow text-sand-mute">Or jump to a service</p>
          <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="link-wipe text-sm text-sand-dim transition-colors hover:text-brass-hi"
                >
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
