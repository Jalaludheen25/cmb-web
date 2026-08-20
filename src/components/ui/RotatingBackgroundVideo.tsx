"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useFrugalConnection, useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

export type Clip = {
  src: string;
  /** Smaller encode served below 820px. */
  mobileSrc?: string;
};

/**
 * Decorative full-bleed video that rotates through several clips.
 *
 * WHY TWO <video> ELEMENTS
 * Swapping `src` on a single element is the obvious implementation and it looks
 * broken: the element tears down its decoder, shows a black frame, then stalls
 * while the next file buffers. With clips this short that would happen every
 * five seconds, right behind the headline.
 *
 * So there are two stacked elements, A and B. One plays while the other sits
 * paused on the *next* clip with `preload="auto"`, already buffered. Shortly
 * before the playing clip ends the idle element starts, the two crossfade on
 * opacity, and their roles swap. Nothing ever waits on the network mid-rotation.
 *
 * Loading discipline matches the single-clip component:
 *   · reduced motion  → poster only, nothing fetched
 *   · Save-Data / 2g  → poster only
 *   · narrow viewport → the smaller encodes
 *   · scrolled away   → paused, so it stops burning battery
 *
 * Only the first clip is fetched on load; each subsequent one is pulled during
 * playback of the one before it, so the initial page weight is a single clip
 * regardless of how many are in the rotation.
 */
export function RotatingBackgroundVideo({
  clips,
  poster,
  className,
  videoClassName,
  overlayClassName,
  crossfadeMs = 900,
}: {
  clips: Clip[];
  poster: string;
  className?: string;
  videoClassName?: string;
  overlayClassName?: string;
  crossfadeMs?: number;
}) {
  const reduced = useReducedMotion();
  const frugal = useFrugalConnection();
  const narrow = useMediaQuery("(max-width: 820px)");

  const containerRef = useRef<HTMLDivElement>(null);
  const slotA = useRef<HTMLVideoElement>(null);
  const slotB = useRef<HTMLVideoElement>(null);

  /** Which element is on screen: 0 = A, 1 = B. */
  const [activeSlot, setActiveSlot] = useState(0);
  /** Index into `clips` currently showing in the active slot. */
  const [activeClip, setActiveClip] = useState(0);
  const [started, setStarted] = useState(false);

  /** Guards the handoff so a burst of timeupdate events fires it only once. */
  const handingOver = useRef(false);
  const onScreen = useRef(true);

  const enabled = !reduced && !frugal && clips.length > 0;
  const single = clips.length === 1;

  const resolve = useCallback(
    (clip: Clip) => (narrow && clip.mobileSrc ? clip.mobileSrc : clip.src),
    [narrow],
  );

  const slotEl = useCallback(
    (slot: number) => (slot === 0 ? slotA.current : slotB.current),
    [],
  );

  // ── Start the first clip, and park the second one ready in the idle slot ──
  useEffect(() => {
    if (!enabled) return;

    const active = slotEl(0);
    const idle = slotEl(1);
    if (!active) return;

    active.src = resolve(clips[0]);
    active.loop = single;
    active.load();

    if (!single && idle) {
      idle.src = resolve(clips[1 % clips.length]);
      idle.load();
    }

    setActiveSlot(0);
    setActiveClip(0);
    handingOver.current = false;

    void active.play().then(() => setStarted(true)).catch(() => {
      /* Autoplay refused — the poster stands in. */
    });
    // `clips` is a stable literal from content; `resolve` changes with viewport.
  }, [enabled, single, clips, resolve, slotEl]);

  // ── Hand over to the idle slot shortly before the current clip ends ───────
  const handleTimeUpdate = useCallback(() => {
    if (!enabled || single || handingOver.current) return;

    const current = slotEl(activeSlot);
    const next = slotEl(1 - activeSlot);
    if (!current || !next) return;
    if (!Number.isFinite(current.duration) || current.duration === 0) return;

    const remaining = current.duration - current.currentTime;
    // Begin the fade early enough that it completes as the clip runs out.
    if (remaining > crossfadeMs / 1000 + 0.12) return;

    handingOver.current = true;

    const nextClip = (activeClip + 1) % clips.length;
    const nextSlot = 1 - activeSlot;

    next.currentTime = 0;
    void next
      .play()
      .then(() => {
        setActiveSlot(nextSlot);
        setActiveClip(nextClip);
      })
      .catch(() => {
        handingOver.current = false;
      });
  }, [enabled, single, activeSlot, activeClip, clips.length, crossfadeMs, slotEl]);

  // ── After a handoff: settle the outgoing slot and queue the clip after next ─
  useEffect(() => {
    if (!enabled || single || !handingOver.current) return;

    const outgoing = slotEl(1 - activeSlot);
    const upcoming = (activeClip + 1) % clips.length;

    const timer = window.setTimeout(() => {
      if (outgoing) {
        outgoing.pause();
        // Re-point the now-hidden element at the clip after this one so it has
        // a full clip's duration to buffer before it is needed.
        outgoing.src = resolve(clips[upcoming]);
        outgoing.load();
      }
      handingOver.current = false;
    }, crossfadeMs + 60);

    return () => window.clearTimeout(timer);
  }, [activeSlot, activeClip, enabled, single, clips, crossfadeMs, resolve, slotEl]);

  // ── Pause everything once scrolled past ──────────────────────────────────
  useEffect(() => {
    const node = containerRef.current;
    if (!node || !enabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen.current = entry.isIntersecting;
        const active = slotEl(activeSlot);
        if (!active) return;
        if (entry.isIntersecting) {
          void active.play().catch(() => {});
        } else {
          slotA.current?.pause();
          slotB.current?.pause();
        }
      },
      { threshold: 0.01 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, activeSlot, slotEl]);

  return (
    <div ref={containerRef} className={cn("absolute inset-0 overflow-hidden", className)}>
      {/* Poster layer — always present, never removed, so there is no flash. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        aria-hidden="true"
        className={cn("absolute inset-0 h-full w-full object-cover", videoClassName)}
      />

      {enabled &&
        [0, 1].map((slot) => (
          <video
            key={slot}
            ref={slot === 0 ? slotA : slotB}
            muted
            playsInline
            preload="auto"
            tabIndex={-1}
            aria-hidden="true"
            data-slot={slot}
            data-active={slot === activeSlot ? "true" : "false"}
            onTimeUpdate={slot === activeSlot ? handleTimeUpdate : undefined}
            style={{ transitionDuration: `${crossfadeMs}ms` }}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity ease-linear",
              slot === activeSlot && started ? "opacity-100" : "opacity-0",
              videoClassName,
            )}
          />
        ))}

      {/* Exposed for the interaction tests, which assert the rotation advances. */}
      <span className="sr-only" data-rotating-clip={activeClip} />

      <div className={cn("absolute inset-0", overlayClassName)} />
      <div className="grain-layer" />
    </div>
  );
}
