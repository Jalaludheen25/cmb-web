"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

/**
 * Scroll-linked word illumination.
 *
 * The paragraph starts dimmed and each word is brought to full contrast as the
 * block travels through the viewport, so reading pace and scroll pace couple.
 * Used once per page — it is an emphasis device, and it stops working the
 * moment it becomes a habit.
 */
export function ScrollWords({
  text,
  className,
  wordClassName,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });

  const words = text.split(" ");

  if (reduced) {
    return <p className={className}>{text}</p>;
  }

  return (
    <p ref={ref} className={cn("flex flex-wrap", className)}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = (i + 1) / words.length;
        return (
          <Word
            key={`${word}-${i}`}
            progress={scrollYProgress}
            range={[start, end]}
            className={wordClassName}
          >
            {word}
          </Word>
        );
      })}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
  className,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  className?: string;
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);

  return (
    <span className={cn("relative mr-[0.28em]", className)}>
      {/* Dimmed ghost keeps the paragraph's full shape visible from the start,
          so the block never reads as broken or half-loaded. */}
      <span className="absolute inset-0 opacity-[0.18]" aria-hidden="true">
        {children}
      </span>
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
}
