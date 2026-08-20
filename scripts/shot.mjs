/**
 * Single-view capture, for checking one thing quickly.
 *
 *   node scripts/shot.mjs <url> <out.png> [width] [height] [scrollToSelector]
 *
 * Scrolls the page end-to-end first so every scroll-triggered reveal has fired,
 * then optionally centres a selector before shooting.
 */
import { chromium } from "playwright";

const [url, out, w = "1512", h = "945", sel] = process.argv.slice(2);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +w, height: +h } });

await page.goto(url, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);

await page.evaluate(async () => {
  const step = window.innerHeight * 0.7;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 190));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(600);

if (sel) {
  await page.evaluate((s) => {
    document.querySelector(s)?.scrollIntoView({ block: "center" });
  }, sel);
}
await page.waitForTimeout(2200);

await page.screenshot({ path: out });
await browser.close();
console.log("saved", out);
