import { chromium } from "playwright";
const b = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
const p = await b.newPage({ viewport: { width: 1512, height: 945 } });
await p.goto("http://localhost:3210/", { waitUntil: "networkidle" });
await p.waitForTimeout(4000);
const r = await p.evaluate(() => [...document.querySelectorAll("video")].map(v => ({
  src: v.currentSrc.split("/").pop(), paused: v.paused, t: +v.currentTime.toFixed(2),
  readyState: v.readyState, w: v.videoWidth,
})));
console.log("HERO VIDEO:", JSON.stringify(r, null, 1));
// scroll to showreel and re-check
await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.62));
await p.waitForTimeout(4000);
const r2 = await p.evaluate(() => [...document.querySelectorAll("video")].map(v => ({
  src: v.currentSrc.split("/").pop(), paused: v.paused, t: +v.currentTime.toFixed(2), w: v.videoWidth,
})));
console.log("AFTER SCROLL:", JSON.stringify(r2, null, 1));
await b.close();
