import { chromium } from "playwright";
const [url, sel, out, w = 1512, h = 945] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +w, height: +h } });
await p.goto(url, { waitUntil: "networkidle" });
await p.evaluate(() => document.fonts.ready);
// prime reveals
await p.evaluate(async () => {
  const step = innerHeight * 0.7;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    scrollTo(0, y); await new Promise(r => setTimeout(r, 200));
  }
});
await p.waitForTimeout(400);
await p.evaluate((s) => document.querySelector(s)?.scrollIntoView({ block: "center" }), sel);
await p.waitForTimeout(2500);
await p.screenshot({ path: out });
await b.close();
console.log("saved", out);
