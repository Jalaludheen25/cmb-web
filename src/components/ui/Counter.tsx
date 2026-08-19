"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Counts a statistic up once, the first time it enters the viewport.
 *
 * `tabular-nums` on the caller's class prevents the horizontal jitter that
 * otherwise makes counters feel cheap as digit widths change mid-count.
 */
export function Counter({
  value,
  duration = 1.9,
  className,
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;

    if (reduced) {
      setDisplay(value);
      return;
    }

    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });

    return () => controls.stop();
  }, [inView, reduced, value, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
