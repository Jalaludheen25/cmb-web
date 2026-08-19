"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

/**
 * Vertical parallax for media blocks.
 *
 * `speed` is the total travel as a fraction of the element's height across the
 * full scroll pass. Keep it small (0.08–0.2): the effect should read as depth,
 * not as a layer sliding out of its frame.
 *
 * The child is scaled slightly so the translation never exposes an edge.
 */
export function Parallax({
  children,
  className,
  speed = 0.12,
  className_inner,
}: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  className_inner?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const shift = `${speed * 100}%`;
  const y = useTransform(scrollYProgress, [0, 1], [`-${shift}`, shift]);

  if (reduced) {
    return (
      <div className={cn("overflow-hidden", className)}>
        <div className={className_inner}>{children}</div>
      </div>
    );
  }

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div
        style={{ y, scale: 1 + speed * 2.2 }}
        className={cn("h-full w-full will-change-transform", className_inner)}
      >
        {children}
      </motion.div>
    </div>
  );
}
