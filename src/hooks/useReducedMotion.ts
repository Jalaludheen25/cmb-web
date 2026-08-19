"use client";

import { useMediaQuery } from "./useMediaQuery";

/**
 * Tracks `prefers-reduced-motion` reactively.
 *
 * Returns `false` on the server so SSR markup matches the no-preference case;
 * the real value is read during the first client render. Components use this to
 * skip motion entirely rather than merely shortening it.
 */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
