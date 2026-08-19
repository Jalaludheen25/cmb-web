"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

/**
 * Per-line mask reveal for display headlines.
 *
 * Each line sits inside an `overflow: hidden` clip and slides up from below it,
 * so the type appears to be uncovered rather than faded in. Lines are authored
 * explicitly (rather than measured at runtime) which keeps the break points
 * art-directed and avoids a layout-thrashing measurement pass.
 *
 * IMPORTANT — why the observer is on the container:
 * The obvious implementation puts `whileInView` on the sliding span itself.
 * That deadlocks. The span starts translated 110% *below* its clip, so its
 * observed rectangle sits well outside the element's laid-out position; for a
 * tall headline the span can be entirely below the fold while the heading is
 * plainly on screen. The visibility threshold is then never satisfied, the
 * animation never starts, and the headline stays permanently hidden. Observing
 * the untransformed container breaks the cycle: what we measure never moves.
 *
 * Accessibility: the visible spans are aria-hidden and the full string is
 * exposed once via an sr-only element, so screen readers read one clean phrase.
 */
export function RevealText({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.1,
  amount = 0.2,
  as: Tag = "h2",
}: {
  lines: readonly string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  /** Fraction of the *container* that must be visible before lines run. */
  amount?: number;
  as?: "h1" | "h2" | "h3" | "p" | "div";
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, amount });
  const full = lines.join(" ");

  if (reduced) {
    return (
      <Tag className={className}>
        {lines.map((line, i) => (
          <span key={`${line}-${i}`} className={cn("block", lineClassName)}>
            {line}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag ref={ref} className={className}>
      <span className="sr-only">{full}</span>
      {lines.map((line, i) => (
        <span key={`${line}-${i}`} className="line-clip" aria-hidden="true">
          <motion.span
            // Deliberately allowed to wrap: the clip grows to fit, so a line
            // that runs long on a narrow screen still reveals correctly instead
            // of being cut off by the mask's own overflow.
            className={cn("block", lineClassName)}
            initial={{ y: "110%" }}
            animate={inView ? { y: "0%" } : { y: "110%" }}
            transition={{
              duration: 1.05,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
