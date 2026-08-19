import Image from "next/image";
import { Parallax } from "@/components/ui/Parallax";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Infrastructure gallery.
 *
 * Three columns, offset vertically and running at different parallax rates, so
 * the block breathes as it passes rather than moving as one slab. Column
 * offsets collapse below `lg` — staggered columns on a phone just read as
 * inconsistent spacing.
 */

const plates = [
  {
    src: "/images/infrastructure/cranes.jpg",
    alt: "Ship-to-shore cranes working a container vessel at night.",
    caption: "Quayside",
    meta: "Ship-to-shore operations",
    ratio: "aspect-[4/5]",
    speed: 0.14,
  },
  {
    src: "/images/infrastructure/aisle.jpg",
    alt: "A racked warehouse aisle stretching into shadow.",
    caption: "Storage",
    meta: "Bonded & ambient racking",
    ratio: "aspect-[4/3]",
    speed: 0.09,
  },
  {
    src: "/images/infrastructure/roads.jpg",
    alt: "Aerial view of a multi-lane interchange at dusk.",
    caption: "Corridors",
    meta: "GCC road network",
    ratio: "aspect-[4/5]",
    speed: 0.17,
  },
  {
    src: "/images/infrastructure/harbour.jpg",
    alt: "Container gantries above a working harbour.",
    caption: "Terminals",
    meta: "Jebel Ali & Khalifa Port",
    ratio: "aspect-[3/4]",
    speed: 0.11,
  },
  {
    src: "/images/infrastructure/forklift.jpg",
    alt: "A forklift moving palletised goods between high racks.",
    caption: "Handling",
    meta: "Pick, pack & VAS",
    ratio: "aspect-[4/3]",
    speed: 0.16,
  },
  {
    src: "/images/infrastructure/beams.jpg",
    alt: "The structural interior of a distribution hall, cranes overhead.",
    caption: "Facilities",
    meta: "40,000 m² under roof",
    ratio: "aspect-[4/5]",
    speed: 0.08,
  },
];

export function Infrastructure() {
  const columns = [
    [plates[0], plates[1]],
    [plates[2], plates[3]],
    [plates[4], plates[5]],
  ];
  const columnOffset = ["lg:mt-0", "lg:mt-24", "lg:mt-10"];

  return (
    <section className="bay bg-ink" aria-labelledby="infrastructure-heading">
      <div className="shell">
        <SectionHeading
          eyebrow="On the ground"
          lines={["Assets you can", "walk around."]}
          standfirst="Forwarding is an asset-light business until it isn't. Where control matters — storage, handling, the last mile — we hold the capability ourselves."
          as="h2"
        />
        <span id="infrastructure-heading" className="sr-only">
          Our infrastructure
        </span>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-8">
          {columns.map((column, columnIndex) => (
            <div key={columnIndex} className={`flex flex-col gap-6 lg:gap-8 ${columnOffset[columnIndex]}`}>
              {column.map((plate) => (
                <Reveal key={plate.src} direction="up" amount={0.12}>
                  <figure className="group/plate">
                    <Parallax
                      speed={plate.speed}
                      className={`relative w-full overflow-hidden rounded-sm ${plate.ratio}`}
                    >
                      <Image
                        src={plate.src}
                        alt={plate.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/plate:scale-[1.04]"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent opacity-0 transition-opacity duration-700 group-hover/plate:opacity-100"
                      />
                    </Parallax>
                    <figcaption className="mt-4 flex items-baseline justify-between gap-4 border-t border-ink-line pt-3">
                      <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-brass">
                        {plate.caption}
                      </span>
                      <span className="text-right text-xs text-sand-dim">{plate.meta}</span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
