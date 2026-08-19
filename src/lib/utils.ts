import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge has to be told about custom font-size utilities.
 *
 * Out of the box it classifies an unrecognised `text-*` class as a COLOUR. So
 * `cn("text-d3", "text-brass-hi")` looked like two competing colours and the
 * size was silently dropped — headings quietly rendered at the inherited 16px
 * with no error anywhere. Registering the scale under `font-size` keeps size
 * and colour in separate conflict groups, where they belong.
 *
 * Any new `--text-*` token added to globals.css must be listed here too.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["mega", "d1", "d2", "d3", "lead", "eyebrow"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Zero-pads an index for the 01 / 02 / 03 editorial numbering used throughout. */
export function pad(n: number, width = 2) {
  return String(n).padStart(width, "0");
}
