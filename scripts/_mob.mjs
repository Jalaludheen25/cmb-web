import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
await p.goto("http://localhost:3001/", { waitUntil: "networkidle" });
await p.waitForTimeout(2500);
const heroInfo = await p.evaluate(() => {
  const vids = [...document.querySelectorAll("section video")];
  return vids.map(v => v.currentSrc.split("/").pop()).filter(Boolean);
});
console.log("mobile hero slots  :", heroInfo.join(", "));
// scroll to showreel
await p.evaluate(async () => {
  const step = innerHeight * 0.7;
  for (let y = 0; y < document.body.scrollHeight; y += step) { scrollTo(0, y); await new Promise(r => setTimeout(r, 180)); }
});
await p.evaluate(() => document.querySelector("#showreel-heading")?.scrollIntoView({ block: "center" }));
await p.waitForTimeout(3000);
const show = await p.evaluate(() => {
  const h = document.querySelector("#showreel-heading");
  const sec = h?.closest("section");
  const v = sec?.querySelector("video");
  const img = sec?.querySelector("img");
  return { video: v?.currentSrc.split("/").pop(), poster: (img?.currentSrc||"").split("/").pop(), paused: v?.paused };
});
console.log("showreel (mobile)  :", JSON.stringify(show));
await b.close();
