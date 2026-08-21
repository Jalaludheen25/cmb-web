/**
 * Verifies the hero background video.
 *
 * Asserts that playback starts, that every clip in the rotation is shown, that
 * the handoff between clips never leaves a gap, and that clips are fetched
 * lazily rather than all at once.
 *
 *   node scripts/rotation.mjs [baseUrl]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:3001";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1512, height: 945 } });

const requested = [];
page.on("request", (r) => {
  const u = r.url();
  if (/\/video\/.*\.mp4/.test(u)) requested.push([Date.now(), u.split("/").pop()]);
});

await page.goto(BASE, { waitUntil: "networkidle" });

// Wait for playback to actually begin before sampling. Until it does the poster
// is what is on screen — correct, and not something to flag as a gap.
const started = await page
  .waitForFunction(
    () =>
      [...document.querySelectorAll("section video")].some(
        (v) => !v.paused && v.currentTime > 0 && parseFloat(getComputedStyle(v).opacity) > 0.5,
      ),
    null,
    { timeout: 30000 },
  )
  .then(() => true)
  .catch(() => false);

const t0 = Date.now();
const fetchedAtStart = [...new Set(requested.map((r) => r[1]))];

const clipCount = await page.evaluate(
  () => Number(document.querySelector("[data-rotating-clip]")?.dataset.clipCount ?? 0),
);
const looping = await page.evaluate(() =>
  [...document.querySelectorAll("section video")].some((v) => v.loop),
);

// Sample long enough to see a full cycle plus a wrap.
const samples = [];
let gaps = 0;

for (let i = 0; i < 80; i++) {
  const s = await page.evaluate(() => {
    const marker = document.querySelector("[data-rotating-clip]");
    const vids = [...document.querySelectorAll("section video")];
    const visible = vids.filter((v) => parseFloat(getComputedStyle(v).opacity) > 0.02);
    return {
      clip: marker?.getAttribute("data-rotating-clip"),
      live: visible.filter((v) => !v.paused && v.readyState >= 2).length,
    };
  });
  samples.push(s);
  if (s.live === 0) gaps++;
  await page.waitForTimeout(300);
}

const order = [];
for (const s of samples) if (order.at(-1) !== s.clip) order.push(s.clip);
const distinct = new Set(samples.map((s) => s.clip)).size;

const lateFetches = requested
  .filter(([t]) => t - t0 > 1500)
  .map(([, f]) => f)
  .filter((f, i, a) => a.indexOf(f) === i);

console.log("declared clips      :", clipCount);
console.log("clip order observed :", order.join(" → "));
console.log("distinct clips seen :", distinct);
console.log("gap samples         :", gaps, "/", samples.length);
console.log("fetched at start    :", fetchedAtStart.join(", ") || "(none)");
console.log("fetched later       :", lateFetches.join(", ") || "(none)");

// A single clip must loop; several must cycle through all of them.
const covers = clipCount <= 1 ? looping && distinct === 1 : distinct >= clipCount;
// Never more than the playing clip plus the one queued behind it.
const lazy = fetchedAtStart.length <= Math.min(2, Math.max(clipCount, 1));

console.log(
  `\n${covers ? "PASS" : "FAIL"}  ${
    clipCount <= 1 ? "single clip, looping continuously" : `cycles through all ${clipCount} clips`
  }`,
);
console.log(`${started ? "PASS" : "FAIL"}  playback starts`);
console.log(`${gaps === 0 ? "PASS" : "FAIL"}  no gap once playing`);
console.log(`${lazy ? "PASS" : "FAIL"}  lazy: ${fetchedAtStart.length} clip(s) fetched at start`);

await browser.close();
process.exit(covers && started && gaps === 0 && lazy ? 0 : 1);
