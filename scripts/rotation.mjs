/**
 * Verifies the hero video rotation: that it advances through every clip, that
 * the handoff never leaves a blank frame, and that clips are fetched lazily.
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
await page.waitForTimeout(1500);

const t0 = Date.now();
const initialFetched = [...new Set(requested.map((r) => r[1]))];

const samples = [];
let blankFrames = 0;

// Full cycle is ~16s (5.0 + 5.0 + 5.9). Sample across ~21s to see it wrap.
for (let i = 0; i < 70; i++) {
  const s = await page.evaluate(() => {
    const marker = document.querySelector("[data-rotating-clip]");
    const vids = [...document.querySelectorAll("section video")];
    const visible = vids.filter((v) => parseFloat(getComputedStyle(v).opacity) > 0.02);
    return {
      clip: marker?.getAttribute("data-rotating-clip"),
      // Is anything actually painting? During a crossfade both are visible.
      painting: visible.length,
      playingAndVisible: visible.filter((v) => !v.paused && v.readyState >= 2).length,
      srcs: vids.map((v) => (v.currentSrc || "").split("/").pop()),
    };
  });
  samples.push(s);
  if (s.playingAndVisible === 0) blankFrames++;
  await page.waitForTimeout(300);
}

const order = [];
for (const s of samples) if (order.at(-1) !== s.clip) order.push(s.clip);

const fetchedByEnd = [...new Set(requested.map((r) => r[1]))];
const lateFetches = requested
  .filter(([t]) => t - t0 > 1000)
  .map(([, f]) => f)
  .filter((f, i, a) => a.indexOf(f) === i);

console.log("clip order observed :", order.join(" → "));
console.log("distinct clips seen :", new Set(samples.map((s) => s.clip)).size);
console.log("blank samples       :", blankFrames, "/", samples.length);
console.log("fetched at load     :", initialFetched.join(", ") || "(none)");
console.log("fetched later       :", lateFetches.join(", ") || "(none)");
console.log("all mp4s fetched    :", fetchedByEnd.join(", "));

const cycled = new Set(samples.map((s) => s.clip)).size >= 3;
const seamless = blankFrames === 0;
const lazy = initialFetched.length <= 2;
console.log(`\n${cycled ? "PASS" : "FAIL"}  rotates through all three clips`);
console.log(`${seamless ? "PASS" : "FAIL"}  no blank frame at any sample`);
console.log(`${lazy ? "PASS" : "FAIL"}  lazy: only ${initialFetched.length} clip(s) fetched on load`);

await browser.close();
process.exit(cycled && seamless && lazy ? 0 : 1);
