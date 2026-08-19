"use client";

import { cn } from "@/lib/utils";

/**
 * Infinite horizontal marquee.
 *
 * Runs on a CSS keyframe rather than JS so it costs nothing on the main thread
 * and keeps moving during hydration. The track is rendered twice and animated
 * to -50%, which is what makes the loop seamless; the duplicate is hidden from
 * assistive technology so the content is announced only once.
 */
export function Marquee({
  children,
  speed = 38,
  reverse = false,
  pauseOnHover = true,
  className,
  fade = true,
}: {
  children: React.ReactNode;
  /** Seconds per full cycle. Larger is slower. */
  speed?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  className?: string;
  fade?: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative flex w-full overflow-hidden",
        fade &&
          "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className,
      )}
    >
      <div
        className={cn(
          "flex w-max shrink-0 items-center",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
        style={{
          animation: `marquee-x ${speed}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
