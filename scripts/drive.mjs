/**
 * Drives the running app through its real interactions.
 *
 *   node scripts/drive.mjs [baseUrl]
 *
 * Each step asserts something a user would actually notice, and captures a
 * frame so the result can be looked at rather than trusted.
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = process.argv[2] ?? "http://localhost:3001";
const OUT = "shots/drive";
await mkdir(OUT, { recursive: true });

const results = [];
const check = (label, ok, detail = "") => {
  results.push({ label, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? ` — ${detail}` : ""}`);
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1512, height: 945 } });

const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

// ── 1. Home loads and the headline is actually visible ──────────────────────
await page.goto(BASE, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(2600);

const h1 = page.locator("h1").first();
const h1Text = (await h1.textContent())?.trim() ?? "";
const h1Shown = await page.evaluate(() => {
  const span = document.querySelector("h1 .line-clip > *");
  if (!span) return false;
  const m = new DOMMatrixReadOnly(getComputedStyle(span).transform);
  return Math.abs(m.m42) < 4; // slid fully into its clip
});
check("home: H1 revealed", h1Shown, h1Text.slice(0, 28));
await page.screenshot({ path: `${OUT}/01-home.png` });

// ── 2. Hero video is actually playing ───────────────────────────────────────
const hero = await page.evaluate(() => {
  const v = document.querySelector("video");
  return v ? { paused: v.paused, t: v.currentTime, w: v.videoWidth } : null;
});
check("home: hero video playing", Boolean(hero && !hero.paused && hero.t > 0),
  hero ? `${hero.w}px @ ${hero.t.toFixed(1)}s` : "no video");

// ── 3. Hovering a service row swaps the sticky stage ────────────────────────
await page.locator("#services").scrollIntoViewIfNeeded();
await page.waitForTimeout(900);
const rows = page.locator("#services ul li a");
await rows.nth(3).hover();
await page.waitForTimeout(1000);
const activeImg = await page.evaluate(() => {
  const panels = [...document.querySelectorAll("#services .sticky .absolute.inset-0")];
  const shown = panels.find((p) => parseFloat(getComputedStyle(p).opacity) > 0.9);
  return shown?.querySelector("img")?.getAttribute("src") ?? "";
});
check("services: hover swaps stage image", activeImg.includes("warehousing"),
  decodeURIComponent(activeImg).split("/").pop()?.slice(0, 40));
await page.screenshot({ path: `${OUT}/02-services-hover.png` });

// ── 4. Globe mounts and renders to a canvas ─────────────────────────────────
await page.locator("#network").scrollIntoViewIfNeeded();
await page.waitForTimeout(2500);
const canvas = await page.evaluate(() => {
  const c = document.querySelector("#network canvas");
  return c ? { w: c.width, h: c.height } : null;
});
check("network: 3D globe canvas mounted", Boolean(canvas && canvas.w > 0),
  canvas ? `${canvas.w}x${canvas.h}` : "no canvas");

// Hovering a corridor should light up the read-out overlay
await page.locator("#network button").nth(2).hover();
await page.waitForTimeout(900);
const readout = await page.locator("#network .rounded-full.border p").first().textContent();
check("network: corridor read-out updates", /Singapore/.test(readout ?? ""), (readout ?? "").trim());
await page.screenshot({ path: `${OUT}/03-globe.png` });

// ── 5. Showreel lightbox opens, plays, and Escape closes it ─────────────────
const playBtn = page.getByRole("button", { name: /Play the CMB Cargo showreel/i });
await playBtn.scrollIntoViewIfNeeded();
await page.waitForTimeout(700);
await playBtn.click();
await page.waitForTimeout(1800);
const dialog = page.getByRole("dialog", { name: /showreel/i });
check("showreel: lightbox opened", await dialog.isVisible());
const lightboxVideo = await page.evaluate(() => {
  const v = document.querySelector('[role="dialog"] video');
  return v ? { controls: v.controls, paused: v.paused } : null;
});
check("showreel: video has controls and plays",
  Boolean(lightboxVideo && lightboxVideo.controls && !lightboxVideo.paused));

// The backdrop must actually occlude the page. A `z-index` inside a stacking
// context looks correct in code and lets content paint straight through.
const occludes = await page.evaluate(() => {
  const el = document.elementFromPoint(80, window.innerHeight - 60);
  return Boolean(el?.closest('[role="dialog"]'));
});
check("showreel: backdrop occludes page content", occludes);
await page.screenshot({ path: `${OUT}/04-lightbox.png` });

await page.keyboard.press("Escape");
await page.waitForTimeout(900);
check("showreel: Escape closes lightbox", (await dialog.count()) === 0);

// ── 6. Navigate to a service detail page via the UI ─────────────────────────
await page.goto(BASE, { waitUntil: "networkidle" });
await page.getByRole("link", { name: "Services", exact: true }).first().click();
await page.waitForURL("**/services");
await page.waitForTimeout(1200);
check("nav: reached /services", page.url().endsWith("/services"), page.url());

await page.getByRole("link", { name: /Air Freight detail/i }).click();
await page.waitForURL("**/services/air-freight");
await page.waitForTimeout(1400);
const detailH1 = (await page.locator("h1").first().textContent())?.trim();
check("nav: reached air-freight detail", /Air Freight/.test(detailH1 ?? ""), detailH1);
await page.screenshot({ path: `${OUT}/05-service-detail.png` });

// ── 7. Contact form: client validation, then the deliberate 503 ─────────────
await page.goto(`${BASE}/contact`, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);

await page.getByRole("button", { name: /Send enquiry/i }).click();
await page.waitForTimeout(600);
const nameInvalid = await page.locator('input[name="name"]').getAttribute("aria-invalid");
check("contact: blocks empty submit", nameInvalid === "true", `aria-invalid=${nameInvalid}`);

await page.locator('input[name="name"]').fill("Test Person");
await page.locator('input[name="email"]').fill("test@example.com");
await page.locator('textarea[name="message"]').fill("Two 40ft HC from Shanghai to Jebel Ali, ready 12 March.");
await page.getByRole("button", { name: /Send enquiry/i }).click();
await page.waitForTimeout(2500);

const alertText = (await page.locator('[aria-live="polite"]').textContent())?.trim() ?? "";
check("contact: unconfigured endpoint fails loudly",
  /not connected yet/i.test(alertText), alertText.slice(0, 72));
await page.screenshot({ path: `${OUT}/06-contact-503.png` });

// ── 8. Mobile menu ──────────────────────────────────────────────────────────
// hasTouch/isMobile so `(pointer: coarse)` matches — that is what keeps Lenis
// disabled here, exactly as on a real handset. Emulating size alone gives a
// fine-pointer phone, which is not a device that exists.
const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
});
await mobile.goto(BASE, { waitUntil: "networkidle" });
await mobile.waitForTimeout(1600);
await mobile.getByRole("button", { name: /Open menu/i }).click();
await mobile.waitForTimeout(1100);
const menu = mobile.getByRole("dialog", { name: /Site menu/i });
check("mobile: menu overlay opens", await menu.isVisible());
await mobile.screenshot({ path: `${OUT}/07-mobile-menu.png` });

// The close button must remain reachable ON TOP of the overlay — a phone has
// no Escape key, so if this is buried the user is trapped in the menu.
const closeBtn = mobile.getByRole("button", { name: /Close menu/i });
check("mobile: close button stays above overlay", await closeBtn.isVisible());
await closeBtn.click({ timeout: 5000 });
await mobile.waitForTimeout(900);
check("mobile: close button dismisses menu", (await menu.count()) === 0);

await mobile.getByRole("button", { name: /Open menu/i }).click();
await mobile.waitForTimeout(1100);
await menu.getByRole("link", { name: /^About$/ }).click();
await mobile.waitForURL("**/about");
await mobile.waitForTimeout(1200);
check("mobile: menu link navigates + closes", mobile.url().endsWith("/about"), mobile.url());
await mobile.screenshot({ path: `${OUT}/08-mobile-about.png` });

// ── Report ──────────────────────────────────────────────────────────────────
await browser.close();

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
const realErrors = [...new Set(errors)].filter((e) => !/404/.test(e));
console.log(`JS errors: ${realErrors.length ? "\n  " + realErrors.join("\n  ") : "none"}`);
process.exit(failed.length ? 1 : 0);
