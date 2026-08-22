/**
 * Audits every piece of text sitting over hero media, on every page, at every
 * breakpoint — and reports how heavily each scrim is darkening its own artwork.
 *
 *   node scripts/heroscrim.mjs [baseUrl]
 *
 * Method: text cannot be measured in place, because light type inflates the
 * reading of its own background. So each element's box and colour are recorded,
 * the hero copy is then hidden, the frame is captured, and each box is sampled
 * from the clean plate. Contrast is computed at the *p90* of background
 * luminance rather than the mean, because legibility fails on bright patches,
 * not on averages.
 *
 * It checks every element, not just the standfirst. An earlier version measured
 * the standfirst alone, passed, and shipped a breadcrumb and eyebrow that had
 * washed out completely — they sit higher up the plate where neither gradient
 * reaches and only the flat tint carries them.
 *
 * WCAG size rule: ≥24px, or ≥18.66px at weight 700+, is "large text" and needs
 * 3:1. Everything else needs 4.5:1.
 */
import { chromium } from "playwright";
import { spawnSync } from "node:child_process";
import { mkdir } from "node:fs/promises";

const BASE = process.argv[2] ?? "http://localhost:3001";
const OUT = "shots/scrim";
await mkdir(OUT, { recursive: true });

const PAGES = [
  ["home", "/"],
  ["services", "/services"],
  ["service-car", "/services/car-export"],
  ["about", "/about"],
  ["contact", "/contact"],
  ["notfound", "/this-page-does-not-exist"],
];

const VIEWPORTS = [
  ["mobile", 390, 844],
  ["tablet", 834, 1112],
  ["desktop", 1512, 945],
];

/* ── WCAG helpers ──────────────────────────────────────────────────────── */
const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const lum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const fromY = (Y) => lum(Y, Y, Y);
const ratio = (a, b) => { const [x, y] = [a, b].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const parseRgb = (s) => (s.match(/\d+(\.\d+)?/g) ?? [255, 255, 255]).slice(0, 3).map(Number);

function sample(file, crop) {
  const r = spawnSync("ffmpeg", ["-hide_banner", "-v", "info", "-i", file,
    "-vf", `crop=${crop},signalstats,metadata=print`, "-f", "null", "-"], { encoding: "utf8" });
  const out = (r.stderr ?? "") + (r.stdout ?? "");
  const g = (k) => Number((out.match(new RegExp(`signalstats\\.${k}=([0-9.]+)`)) ?? [])[1]);
  return { avg: g("YAVG"), p90: g("YHIGH") };
}

const browser = await chromium.launch();
const findings = [];

for (const [vp, width, height] of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width, height } });

  for (const [slug, url] of PAGES) {
    await page.goto(BASE + url, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(2200);

    // Every leaf text node in the hero, with the data needed to judge it.
    const items = await page.evaluate(() => {
      const section = document.querySelector("main section");
      if (!section) return [];
      const shell = section.querySelector(".shell");
      if (!shell) return [];
      /** True when this element, or something between it and the hero, paints
       *  its own opaque ground — a filled button, a chip, a card. The page
       *  behind it is then irrelevant, and sampling it produces a nonsense
       *  reading (a brass button's ink label measured against the sky). */
      const hasOwnGround = (el) => {
        let node = el;
        while (node && node !== shell.parentElement) {
          const bg = getComputedStyle(node).backgroundColor;
          const parts = (bg.match(/[\d.]+/g) ?? []).map(Number);
          const alpha = parts.length === 4 ? parts[3] : bg === "transparent" ? 0 : 1;
          if (bg !== "transparent" && alpha > 0.12) return true;
          node = node.parentElement;
        }
        return false;
      };

      const seen = new Set();
      const out = [];
      for (const el of shell.querySelectorAll("a, p, h1, dt, dd, li")) {
        if (el.querySelector("a, p, h1, dt, dd")) continue;   // leaf text only
        if (el.closest(".sr-only") || el.classList.contains("sr-only")) continue;
        if (hasOwnGround(el)) continue;

        const text = (el.textContent ?? "").trim();
        if (text.length < 2) continue;

        const r = el.getBoundingClientRect();
        if (r.width < 24 || r.height < 6 || r.top < 0) continue;

        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden" || parseFloat(cs.opacity) < 0.5) continue;

        // The mask-reveal wraps each headline line in duplicate spans; measuring
        // the same rectangle repeatedly just inflates the failure count.
        const key = `${Math.round(r.x)},${Math.round(r.y)},${Math.round(r.width)}`;
        if (seen.has(key)) continue;
        seen.add(key);

        const size = parseFloat(cs.fontSize);
        const weight = Number(cs.fontWeight) || 400;
        out.push({
          text: text.slice(0, 26),
          color: cs.color,
          large: size >= 24 || (size >= 18.66 && weight >= 700),
          x: Math.max(0, Math.round(r.x)), y: Math.max(0, Math.round(r.y)),
          w: Math.round(r.width), h: Math.round(r.height),
        });
      }
      return out;
    });

    await page.evaluate(() => {
      document.querySelectorAll("main section .shell").forEach((el) => {
        el.style.visibility = "hidden";
      });
    });
    await page.waitForTimeout(250);

    const file = `${OUT}/${vp}-${slug}.png`;
    await page.screenshot({ path: file });

    for (const it of items) {
      const w = Math.min(it.w, width - it.x);
      const h = Math.min(it.h, height - it.y);
      if (w < 24 || h < 6) continue;
      const s = sample(file, `${w}:${h}:${it.x}:${it.y}`);
      if (!Number.isFinite(s.p90)) continue;
      const [r, g, b] = parseRgb(it.color);
      const need = it.large ? 3 : 4.5;
      const c = ratio(lum(r, g, b), fromY(s.p90));
      findings.push({ vp, slug, ...it, p90: s.p90, need, c, pass: c >= need });
    }
  }
  await page.close();
}

await browser.close();

const failures = findings.filter((f) => !f.pass);

console.log("Hero text over media — contrast at the p90 background, copy hidden to sample\n");
console.log("viewport  page          element                     bgY   need    got");
console.log("─".repeat(76));
// Show the worst case per page/breakpoint, plus every failure.
const worst = new Map();
for (const f of findings) {
  const k = `${f.vp}|${f.slug}`;
  if (!worst.has(k) || f.c < worst.get(k).c) worst.set(k, f);
}
for (const f of worst.values()) {
  console.log(
    `${f.vp.padEnd(9)} ${f.slug.padEnd(13)} ${f.text.padEnd(27)} ` +
    `${String(f.p90).padStart(4)} ${(f.need + ":1").padStart(6)} ${(f.c.toFixed(1) + ":1").padStart(7)}  ${f.pass ? "AA" : "✗ BELOW"}`,
  );
}
console.log(`\nchecked ${findings.length} text elements across ${worst.size} page/breakpoint combinations`);
console.log(`${failures.length === 0 ? "PASS" : "FAIL"}  ${findings.length - failures.length}/${findings.length} clear their AA threshold`);
for (const f of failures) {
  console.log(`   ✗ ${f.vp} ${f.slug} — "${f.text}" ${f.c.toFixed(1)}:1 (needs ${f.need}:1)`);
}
process.exit(failures.length === 0 ? 0 : 1);
