/**
 * Visual QA harness.
 *
 * Drives a real browser over the built site, scrolls each page end-to-end so
 * every scroll-triggered reveal has fired, then captures viewport frames at
 * fixed offsets plus a stitched full-page image. Also collects console errors
 * and failed requests, which is how broken media gets caught before a human
 * has to notice it.
 *
 *   node scripts/shoot.mjs [baseUrl] [outDir]
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = process.argv[2] ?? "http://localhost:3210";
const OUT = process.argv[3] ?? "shots";

const VIEWPORTS = [
  { name: "desktop", width: 1512, height: 945 },
  { name: "tablet", width: 834, height: 1112 },
  { name: "mobile", width: 390, height: 844 },
];

const PAGES = [
  { slug: "home", url: "/" },
  { slug: "services", url: "/services" },
  { slug: "service-sea", url: "/services/sea-freight" },
  { slug: "service-upb", url: "/services/upb-cargo" },
  { slug: "service-car", url: "/services/car-export" },
  { slug: "about", url: "/about" },
  { slug: "contact", url: "/contact" },
  { slug: "notfound", url: "/this-page-does-not-exist" },
];

const problems = [];

/** Scroll the whole page in viewport-sized steps so reveals and lazy media fire. */
async function primePage(page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.75;
    const total = document.body.scrollHeight;
    for (let y = 0; y < total; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 260));
    }
    window.scrollTo(0, total);
    await new Promise((r) => setTimeout(r, 600));
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 700));
  });
}

async function shoot() {
  const browser = await chromium.launch();

  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
    });

    const page = await context.newPage();

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        problems.push(`[console:${viewport.name}] ${msg.text()}`);
      }
    });
    page.on("pageerror", (err) => {
      problems.push(`[pageerror:${viewport.name}] ${err.message}`);
    });
    page.on("requestfailed", (req) => {
      problems.push(
        `[requestfailed:${viewport.name}] ${req.url()} — ${req.failure()?.errorText}`,
      );
    });
    page.on("response", (res) => {
      if (res.status() >= 400 && !res.url().includes("this-page-does-not-exist")) {
        problems.push(`[http${res.status()}:${viewport.name}] ${res.url()}`);
      }
    });

    for (const target of PAGES) {
      const dir = path.join(OUT, viewport.name);
      await mkdir(dir, { recursive: true });

      await page.goto(BASE + target.url, { waitUntil: "networkidle", timeout: 60000 });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(900);

      // Frame 1: above the fold, before any scrolling.
      await page.screenshot({ path: path.join(dir, `${target.slug}-00-fold.png`) });

      await primePage(page);

      // Frames at fixed fractions of the page.
      const height = await page.evaluate(() => document.body.scrollHeight);
      const viewportH = viewport.height;
      const stops = [0.18, 0.36, 0.54, 0.72, 0.9];

      for (const [i, fraction] of stops.entries()) {
        const y = Math.min(Math.round(height * fraction), height - viewportH);
        if (y <= 0) continue;
        await page.evaluate((top) => window.scrollTo(0, top), y);
        await page.waitForTimeout(750);
        await page.screenshot({
          path: path.join(dir, `${target.slug}-${String(i + 1).padStart(2, "0")}.png`),
        });
      }

      // Horizontal-overflow check — a classic responsive failure.
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      if (overflow > 1) {
        problems.push(
          `[overflow:${viewport.name}] ${target.url} overflows horizontally by ${overflow}px`,
        );
      }

      console.log(`✓ ${viewport.name} ${target.url}`);
    }

    await context.close();
  }

  await browser.close();

  await writeFile(
    path.join(OUT, "problems.txt"),
    problems.length ? [...new Set(problems)].join("\n") : "none",
    "utf8",
  );

  console.log(`\n=== PROBLEMS (${new Set(problems).size} unique) ===`);
  console.log(problems.length ? [...new Set(problems)].join("\n") : "none");
}

shoot().catch((err) => {
  console.error(err);
  process.exit(1);
});
