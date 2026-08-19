"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "quiet";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-3 overflow-hidden " +
  "font-mono uppercase tracking-[0.18em] leading-none rounded-full " +
  "transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] " +
  "disabled:pointer-events-none disabled:opacity-45";

const variants: Record<Variant, string> = {
  primary: "bg-brass text-ink hover:bg-brass-hi",
  outline:
    "border border-ink-line text-sand hover:border-brass hover:text-brass-hi bg-transparent",
  quiet: "text-sand hover:text-brass-hi bg-transparent px-0",
};

const sizes: Record<Size, string> = {
  sm: "text-[0.625rem] px-5 py-3",
  md: "text-[0.6875rem] px-7 py-4",
  lg: "text-xs px-9 py-5",
};

/**
 * Primary call-to-action.
 *
 * Pointer-fine devices get a magnetic pull: the button eases toward the cursor
 * inside its own bounds, which makes it feel physically targeted. The effect is
 * spring-damped and clamped to a few pixels — enough to notice, not enough to
 * make the hit target move away from the pointer.
 */
export function Button({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  className,
  magnetic = true,
  arrow = true,
  disabled,
  "aria-label": ariaLabel,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: Variant;
  size?: Size;
  className?: string;
  magnetic?: boolean;
  arrow?: boolean;
  disabled?: boolean;
  "aria-label"?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 22, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 260, damping: 22, mass: 0.4 });

  const active = magnetic && !reduced;

  const handleMove = (event: React.MouseEvent) => {
    if (!active || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = event.clientX - (rect.left + rect.width / 2);
    const relY = event.clientY - (rect.top + rect.height / 2);
    // Clamp the pull so the target never runs away from the cursor.
    x.set(Math.max(-14, Math.min(14, relX * 0.32)));
    y.set(Math.max(-10, Math.min(10, relY * 0.32)));
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const content = (
    <>
      {/* Wipe fill — travels up from the base edge on hover. */}
      {variant !== "quiet" && (
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 origin-bottom scale-y-0 rounded-full",
            "transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]",
            "group-hover/btn:scale-y-100",
            variant === "primary" ? "bg-sand" : "bg-brass",
          )}
        />
      )}
      <span
        className={cn(
          "relative z-10 transition-colors duration-400",
          variant === "primary" && "group-hover/btn:text-ink",
          variant === "outline" && "group-hover/btn:text-ink",
        )}
      >
        {children}
      </span>
      {arrow && (
        <span
          aria-hidden="true"
          className={cn(
            "relative z-10 grid h-3 w-3 place-items-center overflow-hidden",
            variant === "primary" && "group-hover/btn:text-ink",
            variant === "outline" && "group-hover/btn:text-ink",
          )}
        >
          <svg
            viewBox="0 0 12 12"
            fill="none"
            className="h-3 w-3 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-[130%]"
          >
            <path
              d="M1 6h9M6.5 2.5 10 6l-3.5 3.5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg
            viewBox="0 0 12 12"
            fill="none"
            className="absolute h-3 w-3 -translate-x-[130%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-0"
          >
            <path
              d="M1 6h9M6.5 2.5 10 6l-3.5 3.5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </>
  );

  const classes = cn(base, variants[variant], sizes[size], className);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={active ? { x: springX, y: springY } : undefined}
      className="inline-block"
    >
      {href ? (
        <Link href={href} className={classes} aria-label={ariaLabel} data-cursor="link">
          {content}
        </Link>
      ) : (
        <button
          type={type}
          onClick={onClick}
          disabled={disabled}
          className={classes}
          aria-label={ariaLabel}
          data-cursor="link"
        >
          {content}
        </button>
      )}
    </motion.div>
  );
}
