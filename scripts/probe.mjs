import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1512, height: 945 } });
await p.goto("http://localhost:3210/", { waitUntil: "networkidle" });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(3500);
const info = await p.evaluate(() => {
  const h1 = document.querySelector("h1");
  if (!h1) return { found: false };
  const cs = getComputedStyle(h1);
  const r = h1.getBoundingClientRect();
  const clips = [...h1.querySelectorAll(".line-clip")].map((c) => {
    const inner = c.firstElementChild;
    const ir = inner?.getBoundingClientRect();
    const ics = inner ? getComputedStyle(inner) : null;
    return {
      clipRect: { t: c.getBoundingClientRect().top, h: c.getBoundingClientRect().height },
      innerText: inner?.textContent,
      innerRect: ir ? { t: ir.top, h: ir.height } : null,
      transform: ics?.transform,
      opacity: ics?.opacity,
    };
  });
  return {
    found: true,
    text: h1.textContent,
    fontSize: cs.fontSize,
    lineHeight: cs.lineHeight,
    color: cs.color,
    fontFamily: cs.fontFamily,
    rect: { t: r.top, l: r.left, w: r.width, h: r.height },
    clips,
  };
});
console.log(JSON.stringify(info, null, 2));
await b.close();
