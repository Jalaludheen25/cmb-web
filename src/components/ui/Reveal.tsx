"use client";

import { motion, type Variants } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "none";

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 34 },
  down: { x: 0, y: -34 },
  left: { x: 34, y: 0 },
  right: { x: -34, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * The workhorse entrance animation: a short, low-amplitude drift with a long
 * expo ease. Deliberately understated — the reveal should be felt, not watched.
 */
export function Reveal({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.9,
  amount = 0.25,
  once = true,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  duration?: number;
  /** Fraction of the element that must be visible before it triggers. */
  amount?: number;
  once?: boolean;
  as?: "div" | "section" | "li" | "article" | "span";
}) {
  const reduced = useReducedMotion();
  const { x, y } = offsets[direction];
  const Component = motion[as];

  if (reduced) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  return (
    <Component
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Component>
  );
}

/**
 * Staggers direct children of a list/grid. Pair with <RevealItem>.
 */
const groupVariants: Variants = {
  hidden: {},
  shown: (stagger: number) => ({
    transition: { staggerChildren: stagger, delayChildren: 0.05 },
  }),
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  shown: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

export function RevealGroup({
  children,
  className,
  stagger = 0.09,
  amount = 0.15,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  amount?: number;
  as?: "div" | "ul" | "ol" | "section";
}) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  if (reduced) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  return (
    <Component
      className={className}
      custom={stagger}
      variants={groupVariants}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount }}
    >
      {children}
    </Component>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  if (reduced) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  return (
    <Component className={cn(className)} variants={itemVariants}>
      {children}
    </Component>
  );
}
