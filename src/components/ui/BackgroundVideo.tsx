"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

type Connection = { saveData?: boolean; effectiveType?: string };

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
 * Choosing the source on the client means no bytes are wasted before we know
 * the viewport, which matters more than the few hundred milliseconds the poster
 * covers on its own.
 */
export function BackgroundVideo({
  src,
  mobileSrc,
  poster,
  className,
  videoClassName,
  overlayClassName,
}: {
  src: string;
  mobileSrc?: string;
  poster: string;
  className?: string;
  videoClassName?: string;
  overlayClassName?: string;
}) {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [source, setSource] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // Decide whether — and which — video to load.
  useEffect(() => {
    if (reduced) return;

    const connection = (
      navigator as Navigator & { connection?: Connection }
    ).connection;
    if (connection?.saveData) return;
    if (connection?.effectiveType && /2g/.test(connection.effectiveType)) return;

    const narrow = window.matchMedia("(max-width: 820px)").matches;
    setSource(narrow && mobileSrc ? mobileSrc : src);
  }, [reduced, src, mobileSrc]);

  // Pause once fully scrolled past; resume when back in view.
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
        src={poster}
        alt=""
        aria-hidden="true"
        className={cn("absolute inset-0 h-full w-full object-cover", videoClassName)}
      />

      {source && (
        <video
          ref={videoRef}
          poster={poster}
          src={source}
          autoPlay
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
