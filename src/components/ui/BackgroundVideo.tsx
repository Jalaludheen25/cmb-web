"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useFrugalConnection, useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

/**
 * Decorative full-bleed video.
 *
 * The poster image is the real content guarantee — it renders immediately, and
 * the video is layered over it only once we have decided it is worth loading:
 *
 *   · reduced motion  → poster only, video never fetched
 *   · Save-Data / 2g  → poster only
 *   · narrow viewport → the smaller encode
 *   · scrolled away   → paused, to stop it burning battery off-screen
 *
 * Note there is no `autoPlay`. Playback is started by the intersection observer
 * below, which is what lets `preload="none"` actually mean something: no bytes
 * move until the element is on screen and we have settled on which encode to
 * ask for.
 */
export function BackgroundVideo({
  src,
  mobileSrc,
  poster,
  mobilePoster,
  className,
  videoClassName,
  overlayClassName,
}: {
  src: string;
  mobileSrc?: string;
  poster: string;
  /** Use when `mobileSrc` is different *footage* rather than a smaller encode —
   *  otherwise the still and the clip that fades in show different scenes. */
  mobilePoster?: string;
  className?: string;
  videoClassName?: string;
  overlayClassName?: string;
}) {
  const reduced = useReducedMotion();
  const frugal = useFrugalConnection();
  const narrow = useMediaQuery("(max-width: 820px)");

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  // Derived during render — no effect, so there is no frame where the wrong
  // encode is attached to the element.
  const source = reduced || frugal ? null : narrow && mobileSrc ? mobileSrc : src;
  const still = narrow && mobilePoster ? mobilePoster : poster;

  // Play while on screen, pause once past. Also what kicks off the download.
  useEffect(() => {
    const node = containerRef.current;
    if (!node || !source) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (!video) return;
        if (entry.isIntersecting) {
          void video.play().catch(() => {
            /* Autoplay can be refused; the poster remains. */
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.01 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [source]);

  return (
    <div ref={containerRef} className={cn("absolute inset-0 overflow-hidden", className)}>
      {/* Poster layer — always present, never removed, so there is no flash. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={still}
        alt=""
        aria-hidden="true"
        className={cn("absolute inset-0 h-full w-full object-cover", videoClassName)}
      />

      {source && (
        <video
          ref={videoRef}
          poster={still}
          src={source}
          muted
          loop
          playsInline
          preload="none"
          tabIndex={-1}
          aria-hidden="true"
          onCanPlay={() => setReady(true)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000",
            ready ? "opacity-100" : "opacity-0",
            videoClassName,
          )}
        />
      )}

      <div className={cn("absolute inset-0", overlayClassName)} />
      <div className="grain-layer" />
    </div>
  );
}
