/**
 * Verifies the header logo crossfade: white at rest, colour once scrolled,
 * both preloaded, and no reflow of the link box between states.
 *
 * Scroll position matters here. The header hides itself on downward scroll past
 * 420px, and a hidden header still reports `opacity: 1` on its logo — so a naive
 * "scroll to 600 and read the DOM" passes while showing the user nothing. The
 * colour state is therefore checked at 200px, past the 24px colour threshold but
 * short of the hide threshold, and every state additionally asserts the header
 * is actually on screen.
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:3001";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1512, height: 945 } });

const requested = [];
page.on("request", (r) => {
  const m = r.url().match(/cmb-logo-\w+/);
  if (m) requested.push(m[0]);
});

await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForTimeout(2200);

const read = () =>
  page.evaluate(() => {
    const header = document.querySelector("header");
    const link = header.querySelector('a[aria-label*="home"]');
    const box = link.getBoundingClientRect();
    const matrix = new DOMMatrixReadOnly(getComputedStyle(header).transform);
    return {
      headerOnScreen: header.getBoundingClientRect().bottom > 0 && Math.abs(matrix.m42) < 4,
      linkW: +box.width.toFixed(1),
      linkH: +box.height.toFixed(1),
      imgs: [...link.querySelectorAll("img")].map((i) => ({
        file: (i.currentSrc.match(/cmb-logo-\w+/) ?? ["?"])[0],
        op: +parseFloat(getComputedStyle(i).opacity).toFixed(2),
        loaded: i.complete && i.naturalWidth > 0,
      })),
    };
  });

const scrollTo = async (y) => {
  await page.evaluate((top) => window.scrollTo(0, top), y);
  await page.waitForTimeout(1200);
};

const shown = (s) => s.imgs.find((i) => i.op > 0.5)?.file ?? "none";

const atTop = await read();
await scrollTo(200);
const scrolled = await read();
await scrollTo(0);
const backAtTop = await read();

console.log("at top       :", shown(atTop), `headerOnScreen=${atTop.headerOnScreen}`);
console.log("scrollY 200  :", shown(scrolled), `headerOnScreen=${scrolled.headerOnScreen}`);
console.log("back at top  :", shown(backAtTop), `headerOnScreen=${backAtTop.headerOnScreen}`);
console.log("link box     :", `${atTop.linkW}x${atTop.linkH} → ${scrolled.linkW}x${scrolled.linkH}`);
console.log("requested    :", [...new Set(requested)].join(", "));

const whiteFirst = shown(atTop) === "cmb-logo-white";
const colourAfter = shown(scrolled) === "cmb-logo-color";
const reversible = shown(backAtTop) === "cmb-logo-white";
const onScreen = atTop.headerOnScreen && scrolled.headerOnScreen && backAtTop.headerOnScreen;
const noReflow = atTop.linkW === scrolled.linkW && atTop.linkH === scrolled.linkH;
const bothLoaded = atTop.imgs.length === 2 && atTop.imgs.every((i) => i.loaded);

console.log(`\n${whiteFirst ? "PASS" : "FAIL"}  white at the top of the page`);
console.log(`${colourAfter ? "PASS" : "FAIL"}  colour once scrolled`);
console.log(`${reversible ? "PASS" : "FAIL"}  returns to white back at the top`);
console.log(`${onScreen ? "PASS" : "FAIL"}  header actually visible in every state checked`);
console.log(`${noReflow ? "PASS" : "FAIL"}  no reflow of the link box (${atTop.linkW}px throughout)`);
console.log(`${bothLoaded ? "PASS" : "FAIL"}  both finishes preloaded, so the swap never waits`);

await browser.close();
process.exit(
  whiteFirst && colourAfter && reversible && onScreen && noReflow && bothLoaded ? 0 : 1,
);
