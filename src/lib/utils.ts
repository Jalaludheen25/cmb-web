import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Zero-pads an index for the 01 / 02 / 03 editorial numbering used throughout. */
export function pad(n: number, width = 2) {
  return String(n).padStart(width, "0");
}
