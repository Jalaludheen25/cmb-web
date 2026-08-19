import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1512, height: 945 } });
await p.goto("http://localhost:3210/", { waitUntil: "networkidle" });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(1500);
const r = await p.evaluate(() => {
  const probe = (sel, label) => {
    const el = document.querySelector(sel);
    if (!el) return `${label}: NOT FOUND`;
    const cs = getComputedStyle(el);
    return `${label}: font-size=${cs.fontSize} lh=${cs.lineHeight} fvs=${cs.fontVariationSettings} weight=${cs.fontWeight} family=${cs.fontFamily.split(",")[0]}`;
  };
  const out = [];
  out.push(probe("h1", "h1 (mega)"));
  out.push(probe("#services h2", "services h2 (d2)"));
  out.push(probe("#services ul li h3", "service row h3 (d3)"));
  // resolved custom props
  const root = getComputedStyle(document.documentElement);
  out.push("var --text-d3 = " + root.getPropertyValue("--text-d3"));
  out.push("var --text-d2 = " + root.getPropertyValue("--text-d2"));
  // is the utility class present in any stylesheet?
  let found = [];
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        if (rule.cssText && /\.text-d3\b/.test(rule.cssText)) found.push(rule.cssText.slice(0, 160));
      }
    } catch {}
  }
  out.push("rules matching .text-d3: " + (found.length ? found.join(" || ") : "NONE"));
  return out.join("\n");
});
console.log(r);
await b.close();
