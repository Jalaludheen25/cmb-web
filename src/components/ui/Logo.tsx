import { cn } from "@/lib/utils";

/**
 * CMB Cargo identity.
 *
 * The mark is a container-corner bracket that resolves into a "C", with two
 * brass lanes running out of its open side — the company initial and the idea
 * of freight leaving a gate, in one shape. It is drawn on a 44-unit grid with
 * 5-unit strokes so it stays legible down to a 16px favicon.
 *
 * PLACEHOLDER: this is an original mark built for the build. If the client has
 * existing brand artwork, swap the SVG here — every usage flows through this
 * component.
 */
export function Logo({
  className,
  variant = "full",
  markClassName,
}: {
  className?: string;
  variant?: "full" | "mark";
  markClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <svg
        viewBox="0 0 44 44"
        fill="none"
        aria-hidden="true"
        className={cn("h-8 w-8 shrink-0", markClassName)}
      >
        {/* Container-corner bracket → the "C" */}
        <path
          d="M33 8H16a8 8 0 0 0-8 8v12a8 8 0 0 0 8 8h17"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="square"
        />
        {/* Freight lanes leaving the gate */}
        <path d="M20 19.5h22" stroke="var(--color-brass)" strokeWidth="5" strokeLinecap="square" />
        <path d="M20 27.5h13" stroke="var(--color-brass)" strokeWidth="5" strokeLinecap="square" />
      </svg>

      {variant === "full" && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[1.0625rem] font-bold tracking-[0.02em] optic-wide">
            CMB
          </span>
          <span className="mt-[0.2em] font-mono text-[0.5rem] uppercase tracking-[0.34em] text-sand-dim">
            Cargo
          </span>
        </span>
      )}
    </span>
  );
}
