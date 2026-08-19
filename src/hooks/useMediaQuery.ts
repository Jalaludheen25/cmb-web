"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribes to a CSS media query.
 *
 * `useSyncExternalStore` rather than `useState` + `useEffect`: a media query IS
 * an external store, and reading it in an effect means a guaranteed second
 * render pass on every mount plus a tearing window where the component briefly
 * claims the wrong answer. This reads the real value as part of the render that
 * React commits, and re-subscribes only when the query string changes.
 *
 * Returns `false` on the server, so SSR output always matches the
 * no-preference case and hydration stays clean.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onStoreChange);
      return () => list.removeEventListener("change", onStoreChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

type Connection = { saveData?: boolean; effectiveType?: string };

/**
 * True when the visitor has asked us to be careful with their data, or is on a
 * connection slow enough that a decorative video is an act of hostility.
 *
 * Connection state does not meaningfully change mid-session, so the subscribe
 * function is a no-op — we only need the snapshot to be read at render time
 * rather than in an effect.
 */
export function useFrugalConnection(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => {
      const connection = (navigator as Navigator & { connection?: Connection }).connection;
      if (!connection) return false;
      if (connection.saveData) return true;
      return /(^|-)2g$/.test(connection.effectiveType ?? "");
    },
    () => false,
  );
}
