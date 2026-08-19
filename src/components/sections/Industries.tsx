import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { industries } from "@/lib/content";
import { pad } from "@/lib/utils";

/**
 * Sectors served.
 *
 * A hairline-ruled grid built from `gap-px` over an ink-line background, so the
 * dividers stay exactly 1px at every breakpoint without any border-collapse
 * fighting. Hovering fills the cell with the Gulf-green accent — the one place
 * on the home page that colour appears at block scale.
 */
export function Industries() {
  return (
    <section className="bay bg-ink" aria-labelledby="industries-heading">
      <div className="shell">
        <SectionHeading
          eyebrow="Sectors"
          lines={["Cargo has", "a context."]}
          standfirst="A drilling spare, a pallet of vaccines and a container of tyres are not the same shipment with different labels. We price and plan for the difference."
          as="h2"
        />
        <span id="industries-heading" className="sr-only">
          Industries we serve
        </span>

        <RevealGroup
          as="ul"
          stagger={0.05}
          className="mt-16 grid gap-px overflow-hidden rounded-sm bg-ink-line sm:grid-cols-2 lg:mt-20 lg:grid-cols-4"
        >
          {industries.map((industry, i) => (
            <RevealItem
              as="li"
              key={industry.name}
              className="group/cell relative bg-ink transition-colors duration-500 hover:bg-deep"
            >
              <div className="flex h-full flex-col justify-between gap-10 p-7 lg:p-8">
                <span className="font-mono text-[0.625rem] tracking-[0.2em] text-sand-mute transition-colors duration-400 group-hover/cell:text-brass">
                  {pad(i + 1)}
                </span>
                <div>
                  <h3 className="text-lg leading-tight text-sand transition-colors duration-400 group-hover/cell:text-brass-hi">
                    {industry.name}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-sand-mute transition-colors duration-400 group-hover/cell:text-sand-dim">
                    {industry.note}
                  </p>
                </div>
              </div>
              {/* Brass rule that wipes across the base of the cell on hover. */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-brass transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/cell:scale-x-100"
              />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
