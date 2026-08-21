import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * CMB Express Cargo LLC identity.
 *
 * The client's supplied artwork, in three finishes. All three are transparent
 * PNGs at 3526×1942, so the intrinsic ratio below is fixed — pass a height via
 * `className` (`h-11`, `h-14`…) and the width follows.
 *
 *   color  navy "CMB" with the gold bow, gold "EXPRESS CARGO LLC".
 *          Reads well on the ink ground: the gold carries, and the navy has
 *          just enough separation from #08090b to hold its shape. The small
 *          "AIR · SEA · LAND" tagline goes dim at header scale — it is a
 *          decorative third tier, not information the header needs to carry.
 *   white  single-colour knockout, for anywhere the colour version would be
 *          fighting a busy or mid-tone background.
 *   black  for light grounds and print.
 */

const SOURCES = {
  color: "/images/logo/cmb-logo-color.png",
  white: "/images/logo/cmb-logo-white.png",
  black: "/images/logo/cmb-logo-black.png",
} as const;

/** Intrinsic aspect of the supplied artwork: 3526 × 1942. */
const RATIO = 3526 / 1942;
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
  return (
    <Image
      src={SOURCES[variant]}
      alt={alt}
      width={Math.round(INTRINSIC_HEIGHT * RATIO)}
      height={INTRINSIC_HEIGHT}
      priority={priority}
      aria-hidden={alt === "" ? true : undefined}
      className={cn("w-auto object-contain", className)}
      sizes="(max-width: 640px) 140px, 220px"
    />
  );
}
