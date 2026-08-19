import { Marquee } from "@/components/ui/Marquee";
import { corridors, hub } from "@/lib/content";

/**
 * Trade-lane ribbon.
 *
 * Sits directly under the hero as a scale statement: named corridors, at
 * display size, moving. Two counter-running rows stop it reading as a single
 * sliding strip and give the band some depth.
 */
export function TradeLanes() {
  const lanes = corridors.map((c) => `${hub.name} — ${c.name}`);
  const front = lanes.slice(0, 6);
  const back = lanes.slice(6);

  return (
    <section
      aria-label="Principal trade lanes"
      className="relative border-y border-ink-line bg-ink-soft py-8 md:py-10"
    >
      <div className="flex flex-col gap-4 md:gap-5">
        <Marquee speed={54}>
          <LaneRow lanes={front} />
        </Marquee>
        <Marquee speed={66} reverse>
          <LaneRow lanes={back} muted />
        </Marquee>
      </div>
    </section>
  );
}

function LaneRow({ lanes, muted = false }: { lanes: string[]; muted?: boolean }) {
  return (
    <div className="flex items-center">
      {lanes.map((lane) => (
        <span key={lane} className="flex shrink-0 items-center">
          <span
            className={`px-6 font-display text-2xl optic-wide font-medium whitespace-nowrap md:px-9 md:text-4xl ${
              muted ? "text-sand-mute" : "text-sand"
            }`}
          >
            {lane}
          </span>
          <span aria-hidden="true" className="text-brass">
            <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor">
              <path d="M8 0 9.6 6.4 16 8l-6.4 1.6L8 16l-1.6-6.4L0 8l6.4-1.6z" />
            </svg>
          </span>
        </span>
      ))}
    </div>
  );
}
