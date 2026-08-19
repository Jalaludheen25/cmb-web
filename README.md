# CMB Cargo — cmbcargo.ae

A premium marketing site for a UAE freight forwarding and contract logistics
company. Built as an original design: cinematic video, editorial display
typography, scroll-linked motion, and one deliberate 3D moment.

**Stack** — Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
Motion · Lenis · React Three Fiber.

---

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | TypeScript, no emit |
| `npm run lint` | ESLint |
| `npm run shots` | Visual QA — drives a real browser across 3 breakpoints and 6 pages, capturing screenshots and reporting console errors, failed requests and horizontal overflow. Needs the site running; see below. |
| `npm run contrast` | Prints WCAG contrast ratios for every small-text colour pairing in the palette |

```bash
# Visual QA against a production build
npm run build && npm run start -- -p 3210
npm run shots -- http://localhost:3210 shots
```

---

## ⚠️ Before this goes live

The site is complete and production-ready as a build. The **content is not** —
it was written to make the design read correctly, and several categories of it
are plausible invention rather than fact. Everything below must be replaced or
confirmed by the client.

| What | Where | Status |
| --- | --- | --- |
| Phone, email, address, P.O. box | `src/lib/content.ts` → `site.contact` | Invented placeholders |
| The four headline statistics | `src/lib/content.ts` → `stats` | Invented — the section carries a visible "pending verification" note until replaced |
| Accreditations (FIATA, IATA, ISO 9001, AEO…) | `src/lib/content.ts` → `certifications` | **Claiming a credential you do not hold is a legal problem.** List only what is actually held |
| Client testimonials | `src/lib/content.ts` → `testimonials` | Placeholder text, placeholder names. Publish only with written consent |
| Office list | `src/lib/content.ts` → `footprint` | Invented |
| Insight articles | `src/lib/content.ts` → `insights` | Placeholder; links currently resolve to `/contact` |
| Founding year (2009) | `src/lib/content.ts` → `site.founded` | Invented |
| Contact form delivery | `ENQUIRY_WEBHOOK_URL` | **Not configured** — see below |
| Logo | `src/components/ui/Logo.tsx` | Original mark drawn for this build; swap if the client has existing artwork |

Placeholder sections render a visible disclaimer line in the UI so nothing
invented can quietly ship as fact. Delete those lines as you replace the data.

### Contact form

`src/app/api/enquiry/route.ts` validates and forwards submissions to
`ENQUIRY_WEBHOOK_URL`. **Until that variable is set the endpoint returns 503**
and the form tells the visitor to phone or email instead.

This is intentional. The common failure mode for a marketing site is a form that
shows a success message and drops the enquiry on the floor — invisible, and
expensive. This one fails loudly. Copy `.env.example` to `.env.local` and point
it at a CRM intake, a Zapier/Make webhook, a Slack incoming webhook, or your own
mail function.

---

## Typography and font licensing

You asked about **Denam**, **Pixelywave** and **Roundex**. All three are
commercial retail typefaces. They cannot be embedded on a public website without
a paid webfont licence, usually priced per domain or per monthly pageview — so
the build does **not** ship them.

What ships instead, all under the SIL Open Font License 1.1 (unrestricted
commercial use, self-hosting and embedding permitted), served self-hosted by
`next/font` with zero external requests:

| Role | Face | Why |
| --- | --- | --- |
| Display | **Archivo** (variable, `wght` + `wdth`) | The width axis is doing the real work — headlines run at `wdth 125` for poster-scale presence, body headings at 112. A static font cannot do this |
| Body / UI | **Inter** (variable) | Neutral, excellent at small sizes |
| Technical | **JetBrains Mono** | Eyebrows, coordinates, reference codes, stat units. The monospace detailing is what makes the site read as *operational* rather than *corporate* |

**To swap in a licensed commercial face later**, edit the `fontDisplay` export in
`src/lib/fonts.ts` and nothing else. Every heading on the site resolves through
the `--font-display` CSS variable, so one file changes the whole site. The file
contains a worked `next/font/local` example.

---

## Design system

Defined once in `src/app/globals.css` as Tailwind v4 `@theme` tokens.

### Palette — "Desert Obsidian"

Chosen specifically to avoid the blue-and-white default of the logistics
category. Warm-shifted blacks, warm off-white, burnished brass, and one deep
Gulf green used sparingly at block scale.

| Token | Value | Use |
| --- | --- | --- |
| `ink` / `ink-soft` / `ink-raise` | `#08090b` `#0f1114` `#16191e` | Grounds. Never pure black |
| `ink-line` | `#23272e` | Every hairline rule |
| `sand` / `sand-soft` | `#f4efe6` `#e7e0d3` | Primary type. Never pure white |
| `sand-dim` / `sand-mute` | `#a8a296` `#837d72` | Secondary and tertiary type |
| `brass` / `brass-hi` / `brass-low` | `#c98b3f` `#e9be7c` `#8a5c24` | The signature. Accents, CTAs, active states |
| `deep` / `deep-hi` | `#0c3330` `#17514c` | Contrast blocks (testimonials, industry cell hover) |

Every small-text pairing clears **WCAG AA (4.5:1)** — verify with
`npm run contrast` after any palette change.

### Type scale

Fluid `clamp()` tokens — `text-mega`, `text-d1`, `text-d2`, `text-d3`,
`text-lead`, `eyebrow`. No breakpoint juggling; sizes interpolate with the
viewport.

> **If you add a `--text-*` token, also add it to the `font-size` class group in
> `src/lib/utils.ts`.** `tailwind-merge` classifies unrecognised `text-*`
> classes as *colours*, so `cn("text-d3", "text-brass")` silently drops the size
> and the heading renders at the inherited 16px with no error anywhere. This bit
> us once during the build.

### Custom utilities

`shell` (page gutter) · `bay` (section rhythm) · `eyebrow` · `optic-wide` /
`optic-narrow` (display width axis) · `media-scrim` · `link-wipe` ·
`grain-layer` · `line-clip`.

---

## Architecture

```
src/
  app/
    layout.tsx              Fonts, metadata, JSON-LD, chrome
    page.tsx                Home — section order is a deliberate rhythm
    services/               Index + [slug] detail (SSG, 6 routes)
    about/  contact/
    api/enquiry/route.ts    Form intake — fails loudly if unconfigured
    sitemap.ts  robots.ts  not-found.tsx
  components/
    layout/                 Header, Footer, SmoothScroll, Cursor
    sections/               One file per page section
    three/Globe.tsx         The 3D network globe
    ui/                     Reveal, RevealText, ScrollWords, Parallax,
                            Counter, Marquee, Button, BackgroundVideo, …
  hooks/useReducedMotion.ts
  lib/                      content.ts · fonts.ts · utils.ts
```

**All copy lives in `src/lib/content.ts`.** No component hard-codes a string, so
the client can revise wording without touching layout or animation code.

---

## Motion

Everything decorative is disabled under `prefers-reduced-motion` — components
check the hook and skip the animation entirely rather than merely shortening it,
and a global CSS rule collapses any remaining transition. No content is ever
hidden behind an animation that might not run.

**One trap worth knowing about**, documented at length in `RevealText.tsx`: the
obvious way to build a per-line mask reveal is `whileInView` on the sliding
span. It deadlocks. The span starts translated 110% *below* its clip, so for a
tall headline its observed rectangle can sit entirely below the fold while the
heading is plainly on screen — the visibility threshold is never met, the
animation never starts, and the headline stays permanently invisible. The
observer goes on the untransformed container instead.

Smooth scrolling (Lenis) runs on fine pointers only. Touch devices keep native
momentum scrolling, which feels better than any polyfill.

---

## Media

25 photographs and 3 video encodes in `public/`, all sourced from Pexels under
the [Pexels License](https://www.pexels.com/license/) — free for commercial use,
no attribution required. Replace with the client's own photography when
available; real facilities always outperform stock.

Video is transcoded to two encodes each (1920 and 1080 wide, H.264, no audio,
`faststart`). `BackgroundVideo` decides at runtime whether to fetch any of it:

- reduced motion → poster only, video never requested
- `Save-Data` or a 2G connection → poster only
- narrow viewport → the smaller encode
- scrolled out of view → paused, so it stops burning battery

The poster image renders immediately and is never removed, so there is no flash
and no layout shift.

---

## Accessibility

Skip link · single `h1` per page with a logical heading order · visible
`:focus-visible` rings · `aria-live` form status · focus trap and Escape on both
the video lightbox and the mobile menu, with focus returned to the trigger ·
`sr-only` full strings behind every split-line headline · decorative imagery
carries `alt=""` · every interactive target is a real `<button>` or `<a>`.

The custom cursor is **additive** — the native cursor is deliberately not
hidden, so text-selection affordances survive and a JS failure strands nobody.

---

## Deploy

Static apart from `/api/enquiry`. Vercel needs no configuration beyond setting
`ENQUIRY_WEBHOOK_URL`. Any Node host works with `npm run build && npm run start`.

Before going live: replace the placeholder content above, set
`ENQUIRY_WEBHOOK_URL`, point `site.url` in `src/lib/content.ts` at the real
origin if it ever differs from `https://cmbcargo.ae`, and add a real favicon and
OG image.
