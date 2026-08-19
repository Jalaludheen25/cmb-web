// WCAG contrast checker for the palette's small-text pairings.
const hex = (h) => h.replace("#","").match(/../g).map(x => parseInt(x,16));
const lin = (c) => { c/=255; return c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4); };
const lum = ([r,g,b]) => 0.2126*lin(r) + 0.7152*lin(g) + 0.0722*lin(b);
const blend = (fg, bg, a) => fg.map((c,i) => Math.round(a*c + (1-a)*bg[i]));
const ratio = (a, b) => { const [x,y] = [lum(a), lum(b)].sort((p,q)=>q-p); return (x+0.05)/(y+0.05); };

const C = {
  ink: hex("#08090b"), inkSoft: hex("#0f1114"), deep: hex("#0c3330"),
  sand: hex("#f4efe6"), sandSoft: hex("#e7e0d3"), sandDim: hex("#a8a296"),
  sandMute: hex("#837d72"), brass: hex("#c98b3f"), brassHi: hex("#e9be7c"),
};

const rows = [
  ["sand on ink", C.sand, C.ink, 1],
  ["sand-soft on ink", C.sandSoft, C.ink, 1],
  ["sand-dim on ink", C.sandDim, C.ink, 1],
  ["sand-mute on ink", C.sandMute, C.ink, 1],
  ["sand-mute on ink-soft", C.sandMute, C.inkSoft, 1],
  ["brass on ink", C.brass, C.ink, 1],
  ["brass-hi on ink", C.brassHi, C.ink, 1],
  ["sand/60 on deep", C.sand, C.deep, 0.6],
  ["sand/70 on deep", C.sand, C.deep, 0.7],
  ["brass on deep", C.brass, C.deep, 1],
  ["ink/60 on sand", C.ink, C.sand, 0.6],
  ["ink/65 on sand", C.ink, C.sand, 0.65],
  ["ink/70 on sand", C.ink, C.sand, 0.7],
  ["ink on brass (button)", C.ink, C.brass, 1],
];

for (const [label, fg, bg, a] of rows) {
  const r = ratio(blend(fg, bg, a), bg);
  const aa = r >= 4.5 ? "AA " : r >= 3 ? "AA-large" : "FAIL";
  console.log(`${label.padEnd(26)} ${r.toFixed(2).padStart(6)}:1  ${aa}`);
}
