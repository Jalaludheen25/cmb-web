import { Archivo, Inter, JetBrains_Mono } from "next/font/google";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CMB CARGO — TYPEFACE STACK
 * ─────────────────────────────────────────────────────────────────────────────
 *  All three families below ship under the SIL Open Font License 1.1, which
 *  permits unrestricted commercial use, self-hosting and embedding. They are
 *  served self-hosted by `next/font` (zero external requests, no layout shift).
 *
 *  SWAPPING IN A LICENSED COMMERCIAL DISPLAY FACE
 *  ----------------------------------------------
 *  Faces such as Denam, Roundex or Pixelywave are commercial releases and must
 *  be licensed per-domain before they can be embedded. Once you hold a webfont
 *  licence, drop the .woff2 files into `src/assets/fonts/` and replace the
 *  `fontDisplay` export below — nothing else in the codebase changes, because
 *  every heading resolves through the `--font-display` CSS variable:
 *
 *    import localFont from "next/font/local";
 *    export const fontDisplay = localFont({
 *      src: [
 *        { path: "../assets/fonts/Denam-Medium.woff2", weight: "500", style: "normal" },
 *        { path: "../assets/fonts/Denam-Bold.woff2",   weight: "700", style: "normal" },
 *      ],
 *      variable: "--font-display",
 *      display: "swap",
 *    });
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Display / headline face. Variable across weight AND width — the wide optical
 *  sizes are what give the headline blocks their poster-like presence. */
export const fontDisplay = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-display",
});

/** Body / UI face. */
export const fontSans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

/** Technical face — eyebrows, coordinates, reference codes, stat units.
 *  The monospace detailing is what reads as "operational" rather than "corporate". */
export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const fontVariables = `${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable}`;
