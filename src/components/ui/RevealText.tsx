"use client";

import { motion } from "motion/react";
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
 * Accessibility: the visible spans are aria-hidden and the full string is
 * exposed once via an sr-only element, so screen readers read one clean phrase.
 */
export function RevealText({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.1,
  as: Tag = "h2",
}: {
  lines: readonly string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "p" | "div";
}) {
  const reduced = useReducedMotion();
  const full = lines.join(" ");

  if (reduced) {
    return (
      <Tag className={className}>
        {lines.map((line) => (
          <span key={line} className={cn("block", lineClassName)}>
            {line}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag className={className}>
      <span className="sr-only">{full}</span>
      {lines.map((line, i) => (
        <span key={`${line}-${i}`} className="line-clip" aria-hidden="true">
          <motion.span
            className={cn("block", lineClassName)}
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, amount: 0.6 }}
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
