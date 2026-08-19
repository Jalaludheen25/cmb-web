import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { insights } from "@/lib/content";

/**
 * Insights.
 *
 * The single light section on the page. After a long dark sequence it reads as
 * turning a page into an editorial supplement, and it gives the eye somewhere
 * to rest before the footer.
 */
export function Insights() {
  return (
    <section className="bay bg-sand text-ink" aria-labelledby="insights-heading">
      <div className="shell">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Insights"
            lines={["Notes from", "the desk."]}
            standfirst="Occasional writing on trade lanes, customs practice and the parts of freight that only show up on an invoice."
            tone="light"
            as="h2"
          />
          <div className="shrink-0 lg:pb-3">
            <Button href="/contact" variant="outline" className="border-ink/25 text-ink hover:text-ink">
              Get in touch
            </Button>
          </div>
        </div>
        <span id="insights-heading" className="sr-only">
          Insights
        </span>

        <RevealGroup
          as="ul"
          stagger={0.1}
          className="mt-16 grid gap-10 md:grid-cols-3 lg:mt-20 lg:gap-8"
        >
          {insights.map((article) => (
            <RevealItem as="li" key={article.title}>
              <article className="group/card h-full">
                <Link href="/contact" className="flex h-full flex-col" data-cursor="link">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-ink/10">
                    <Image
                      src={article.image}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-105"
                    />
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-brass-low">
                      {article.category}
                    </span>
                    <span aria-hidden="true" className="h-3 w-px bg-ink/20" />
                    <time
                      dateTime={article.date}
                      className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink/50"
                    >
                      {new Date(article.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </time>
                  </div>

                  <h3 className="mt-4 text-xl leading-snug text-ink transition-colors duration-400 group-hover/card:text-brass-low">
                    {article.title}
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/65">
                    {article.excerpt}
                  </p>

                  <span className="mt-6 flex items-center gap-3 border-t border-ink/15 pt-4 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-ink/55">
                    {article.readTime} read
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                      className="h-3 w-3 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:translate-x-1"
                    >
                      <path
                        d="M2 8h11M9 4l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Link>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        <p className="mt-12 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink/40">
          Placeholder articles — links resolve to contact until the journal is live.
        </p>
      </div>
    </section>
  );
}
