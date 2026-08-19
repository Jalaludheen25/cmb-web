"use client";

import { useEffect, useState } from "react";

/**
 * Tracks `prefers-reduced-motion` reactively.
 *
 * Returns `false` during SSR and the first client render so that markup matches
 * between server and client; the real value lands on the first effect pass.
 * Components use this to skip motion entirely rather than merely shortening it.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
