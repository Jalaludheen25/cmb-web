import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * CMB Express Cargo LLC identity.
 *
 * Pass a height via `className` (`h-11`, `h-14`…) and the width follows from the
 * artwork's own dimensions.
 *
 *   color  The current lockup: royal-blue "CMB" with the gold bow, gold
 *          "EXPRESS CARGO LLC". Reads well on the ink ground — the blue is
 *          considerably brighter than the mark it replaced, which was a dark
 *          navy that struggled against #08090b.
 *   white  Single-colour knockout of the *same* lockup, used at the top of the
 *          page before the header gains its backdrop. Derived from the colour
 *          artwork's own alpha channel, so the two align exactly and the header
 *          can crossfade between them without any shift.
 *   black  For light grounds and print.
 *
 * ⚠️ `black` is still the PREVIOUS lockup — a different shape, and 1.816 wide
 * where the current pair is 2.013. Nothing uses it today, which is why it has
 * been left alone rather than regenerated, but ask the client for a black
 * version of the new artwork before putting it anywhere.
 *
 * Dimensions are per-variant for that reason: a single shared ratio constant
 * would silently letterbox or stretch whichever variant did not match.
 */

const SOURCES = {
  color: { src: "/images/logo/cmb-logo-color.png", width: 2744, height: 1363 },
  white: { src: "/images/logo/cmb-logo-white.png", width: 2744, height: 1363 },
  black: { src: "/images/logo/cmb-logo-black.png", width: 3526, height: 1942 },
} as const;

/** Rendered at ~1.5× the largest on-screen height, for crisp hi-DPI output. */
const INTRINSIC_HEIGHT = 120;

export function Logo({
  variant = "color",
  className,
  alt = "",
  priority = false,
}: {
  variant?: keyof typeof SOURCES;
  className?: string;
  /** Leave empty when the logo sits inside an already-labelled link. */
  alt?: string;
  priority?: boolean;
}) {
  const source = SOURCES[variant];
  const ratio = source.width / source.height;

  return (
    <Image
      src={source.src}
      alt={alt}
      width={Math.round(INTRINSIC_HEIGHT * ratio)}
      height={INTRINSIC_HEIGHT}
      priority={priority}
      aria-hidden={alt === "" ? true : undefined}
      className={cn("w-auto object-contain", className)}
      sizes="(max-width: 640px) 160px, 240px"
    />
  );
}
