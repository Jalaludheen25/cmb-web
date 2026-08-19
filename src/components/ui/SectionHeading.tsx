"use client";

import { Reveal } from "./Reveal";
import { RevealText } from "./RevealText";
import { cn } from "@/lib/utils";

/**
 * The repeating section masthead: a monospace eyebrow with a brass tick, a
 * mask-revealed display heading, and optional standfirst. Using one component
 * everywhere is what keeps the page rhythm consistent across sections.
 */
export function SectionHeading({
  eyebrow,
  lines,
  standfirst,
  align = "left",
  tone = "dark",
  className,
  as = "h2",
  headingClassName,
}: {
  eyebrow: string;
  lines: readonly string[];
  standfirst?: string;
  align?: "left" | "center";
  /** `dark` = light type on ink. `light` = ink type on sand. */
  tone?: "dark" | "light";
  className?: string;
  as?: "h1" | "h2" | "h3";
  headingClassName?: string;
}) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col",
        centered && "items-center text-center",
        className,
      )}
    >
      <Reveal direction="up" duration={0.7}>
        <p
          className={cn(
            "eyebrow flex items-center gap-3",
            tone === "dark" ? "text-sand-dim" : "text-ink/55",
          )}
        >
          <span aria-hidden="true" className="inline-block h-px w-8 bg-brass" />
          {eyebrow}
        </p>
      </Reveal>

      <RevealText
        as={as}
        lines={lines}
        delay={0.05}
        className={cn(
          "mt-6 text-d2 optic-wide",
          tone === "dark" ? "text-sand" : "text-ink",
          headingClassName,
        )}
      />

      {standfirst && (
        <Reveal direction="up" delay={0.15}>
          <p
            className={cn(
              "mt-7 max-w-2xl text-lead",
              centered && "mx-auto",
              tone === "dark" ? "text-sand-dim" : "text-ink/70",
            )}
          >
            {standfirst}
          </p>
        </Reveal>
      )}
    </div>
  );
}
