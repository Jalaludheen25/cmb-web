"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * Bespoke pointer: a hard brass dot that tracks exactly, plus a soft ring that
 * lags behind on a spring and swells over interactive elements.
 *
 * The native cursor is deliberately NOT hidden. Hiding it is the usual move and
 * it is a mistake — it breaks text selection affordances and leaves users
 * stranded if the JS fails. Here the custom layer is purely additive.
 *
 * Rendered only for fine pointers, and never when reduced motion is requested.
 */
export function Cursor() {
  const reduced = useReducedMotion();
  const finePointer = useMediaQuery("(pointer: fine)");
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 180, damping: 20, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 180, damping: 20, mass: 0.5 });

  const enabled = finePointer && !reduced;

  useEffect(() => {
    if (!enabled) return;

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);

      const target = event.target as Element | null;
      setActive(Boolean(target?.closest?.('a, button, [data-cursor="link"]')));
    };

    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90]">
      <motion.span
        style={{ x, y }}
        animate={{ opacity: visible ? 1 : 0, scale: active ? 0 : 1 }}
        transition={{ duration: 0.25 }}
        className="absolute -ml-[3px] -mt-[3px] block h-1.5 w-1.5 rounded-full bg-brass-hi"
      />
      <motion.span
        style={{ x: ringX, y: ringY }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: active ? 1.9 : 1,
          borderColor: active ? "var(--color-brass-hi)" : "var(--color-sand-mute)",
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -ml-4 -mt-4 block h-8 w-8 rounded-full border"
      />
    </div>
  );
}
