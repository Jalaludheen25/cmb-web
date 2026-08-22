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
| `npm run shots` | Visual QA — drives a real browser across 3 breakpoints and 8 pages, capturing screenshots and reporting console errors, failed requests and horizontal overflow. Needs the site running; see below. |
| `npm run drive` | Interaction QA — clicks through the real UI (service hover, 3D globe, video lightbox, contact form, mobile menu) and asserts 17 behaviours. Catches the class of bug a screenshot cannot: stacking contexts, focus traps, unreachable close buttons |
| `npm run logoswap` | Verifies the header logo crossfade — white at rest, colour once scrolled, reversible, no reflow, header actually visible |
| `npm run rotation` | Verifies the hero video rotation — cycles through every clip, no blank frame at the handoff, loading stays lazy |
| `npm run shot` | One-off capture: `npm run shot -- <url> <out.png> [w] [h] [selector]` |
| `npm run heroscrim` | Audits every text element sitting over hero media — hides the copy, samples the real background, and checks contrast at the p90 for all pages × breakpoints. Catches what `contrast` cannot |
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
| Phone `+971 56 118 4859` | `src/lib/content.ts` → `site.contact.phone` | ✅ Real. Also used for WhatsApp |
| Email `enquiry@cmbcargo.ae` | `src/lib/content.ts` → `site.contact.email` | ✅ Real. `salesEmail` deliberately points at the same mailbox — see below |
| Postal address, P.O. box | `src/lib/content.ts` → `site.contact.address` | Still invented |
| The four headline statistics | `src/lib/content.ts` → `stats` | Invented — the section carries a visible "pending verification" note until replaced |
| Accreditations (FIATA, IATA, ISO 9001, AEO…) | `src/lib/content.ts` → `certifications` | **Claiming a credential you do not hold is a legal problem.** List only what is actually held |
| Client testimonials | `src/lib/content.ts` → `testimonials` | Placeholder text, placeholder names. Publish only with written consent |
| Office list | `src/lib/content.ts` → `footprint` | Invented |
| Insight articles | `src/lib/content.ts` → `insights` | Placeholder; links currently resolve to `/contact` |
| Founding year (2009) | `src/lib/content.ts` → `site.founded` | Invented |
| Contact form delivery | `ENQUIRY_WEBHOOK_URL` | **Not configured** — see below |
| Logo | `public/images/logo/` | ✅ Client artwork, three finishes (`color`, `white`, `black`) |
| Favicon | `src/app/favicon.ico` | Still the Next.js default — generate one from the logo |

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

Note `salesEmail` intentionally resolves to the same `enquiry@cmbcargo.ae`
mailbox. There is no separate `quotes@` address, and publishing one that bounces
loses enquiries silently — worse than having a single address.

### WhatsApp

A floating button sits on every page (`src/components/layout/WhatsAppButton.tsx`,
mounted in the root layout), deep-linking to `wa.me/971561184859` with a short
pre-filled message. The number and prefill both come from `content.ts`.

It is in WhatsApp's own green rather than the site palette on purpose: it is a
functional affordance people scan for, and a brass one would disappear into the
design. It sits at `z-30` — above page content, below the mobile menu (`z-40`)
and the video lightbox (`z-80`) — and is explicitly marked `inert` while the
mobile menu is open, so keyboard users cannot tab to a button hidden underneath
the overlay.

### Logo

Client artwork in `public/images/logo/`, three finishes exposed through
`src/components/ui/Logo.tsx` as `variant="color" | "white" | "black"`.

**The header crossfades.** White at the top of the page, colour once the reader
scrolls past 24px, reversing on the way back up. Both finishes are in the DOM
from the first paint and only opacity animates, so the swap never waits on a
network request and the link box never reflows (both files share identical
intrinsic dimensions). Verify with `npm run logoswap`.

### ⚠️ `white` is derived, not supplied

The client supplied a colour file only. The white knockout is generated from
that same artwork's alpha channel (RGB filled white, alpha preserved), so the
two lockups align exactly and the header can crossfade without any shift.

Regenerate it whenever the colour art changes, or the header will crossfade
between two different marks:

```bash
cd public/images/logo
ffmpeg -y -i cmb-logo-color.png -f lavfi -i "color=white:s=<W>x<H>" \
  -filter_complex "[0:v]alphaextract[a];[1:v][a]alphamerge" \
  -frames:v 1 -update 1 cmb-logo-white.png
```

`cmb-logo-black.png` is **still the previous lockup** — a different shape, 1.816
wide against the current pair's 2.013. Nothing uses it, which is why it was left
alone; ask the client for a black version of the current artwork before putting
it anywhere. `Logo.tsx` stores dimensions per variant for exactly this reason: a
single shared ratio constant would silently distort whichever file did not match.

### Swapping the artwork

Next caches optimised images by source URL. Replacing a file in place leaves the
**old** image being served locally until you clear that cache — the swap looks
like it silently did nothing:

```bash
rm -rf .next/cache/images
```

A production deploy starts with a cold cache, so this is a local-development
trap rather than a shipping one. The giveaway is the rendered width not changing
when the new artwork has a different aspect ratio.

> **Testing the header is position-sensitive.** It hides itself on downward
> scroll past 420px, and a hidden header still reports `opacity: 1` on its logo
> — so "scroll to 600, read the DOM" passes while the user sees nothing at all.
> Check the colour state at ~200px, and assert the header is actually on screen.
> `logoswap.mjs` does both.

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

> **Text over video is a separate problem.** `npm run contrast` checks flat
> colour pairings only; it cannot see the hero, where the background is moving
> footage under three stacked scrims. If you retune those, measure the real
> thing: screenshot the hero with `section .shell` set to `visibility:hidden`,
> sample the band where the standfirst sits, and compute the ratio against
> `sand-soft`. Check **every breakpoint** — the standfirst sits ~79% down the
> hero on desktop but ~57% on a phone, so one gradient hits the two positions at
> very different strengths, and a change that looks fine on a laptop can put
> mobile below AA. The floor gradient is deliberately breakpoint-aware for
> exactly this reason.

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
    services/               Index + [slug] detail (SSG, 8 routes)
    about/  contact/
    api/enquiry/route.ts    Form intake — fails loudly if unconfigured
    sitemap.ts  robots.ts  not-found.tsx
  components/
    layout/                 Header, Footer, SmoothScroll, Cursor,
                            WhatsAppButton
    sections/               One file per page section
    three/Globe.tsx         The 3D network globe
    ui/                     Reveal, RevealText, ScrollWords, Parallax,
                            Counter, Marquee, Button, BackgroundVideo, …
  hooks/useReducedMotion.ts
  lib/                      content.ts · fonts.ts · utils.ts
```

**All copy lives in `src/lib/content.ts`.** No component hard-codes a string, so
the client can revise wording without touching layout or animation code.

### Services

Eight, in this order — the array order in `content.ts` *is* the display order,
and it drives the home list, the services index, the footer, the mobile menu,
`generateStaticParams` and the sitemap:

| # | Service | Slug |
| --- | --- | --- |
| 01 | Air Freight | `air-freight` |
| 02 | Sea Freight (FCL/LCL) | `sea-freight` |
| 03 | Land Transport | `land-transport` |
| 04 | Car Export | `car-export` |
| 05 | Import/Export Customs Clearance | `customs-clearance` |
| 06 | UPB / Personal & Commercial Cargo | `upb-cargo` |
| 07 | Warehousing & Distribution | `warehousing` |
| 08 | Project & Heavy Lift | `project-cargo` |

Two gotchas when editing this list:

- **`index` is a manual string** (`"01"`…`"08"`) shown in the UI. Renumber the
  rest if you insert or reorder.
- **`enquiryTypes` is validated server-side.** `app/api/enquiry/route.ts`
  rejects any submission whose enquiry type is not in that array, so the two
  must be edited together or the contact form starts 422-ing silently.

Service copy for all eight is written to fit the house voice, but the specifics
(gateways, transit claims, capabilities) are informed invention — have the
client confirm them along with everything in the table above.

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

27 photographs in `public/images`, sourced from Pexels under the
[Pexels License](https://www.pexels.com/license/) — free for commercial use, no
attribution required. Replace with the client's own photography when available;
real facilities always outperform stock.

**Video is client-supplied.** The mobile showreel is transcoded client footage;
the desktop showreel is still Pexels stock.

### ⚠️ The hero video is served uncompressed, by request

`public/video/hero-colour.mp4` is a **byte-identical copy** of the supplied
`Hero Page Background Colour.mp4` (2560×1440, 30 fps, 7.5 s, **10.3 MB**),
verified by SHA-256. It is not re-encoded, and there is deliberately no mobile
variant — **phones download the full 10.3 MB**.

It is the single largest thing on the site. Three mitigations are in place: the
poster paints immediately so nothing waits on it, playback only starts once the
hero is on screen, and `Save-Data` / 2G visitors never fetch it at all. If the
weight becomes a problem, a visually indistinguishable encode is one command:

```bash
ffmpeg -i public/video/hero-colour.mp4 -vf "scale=1920:-2" -c:v libx264 \
  -crf 24 -preset slow -movflags +faststart -an public/video/hero-colour-web.mp4
```

**Name the file, don't overwrite it.** `next.config.ts` serves `/video/*` with a
30-day `max-age`, so swapping footage in at an existing URL leaves returning
visitors watching the old clip until their cache expires. Each new hero gets a
new filename; `hero.clips` in `content.ts` is the only thing to repoint.

The file also carries an **AAC audio track**. It is left in place (removing it
would mean rewriting the file) and is harmless — the player is `muted` — but it
is bytes nobody hears. `-c copy -an` strips it losslessly if you want them back.

### ⚠️ Raw masters are still in `public/`

Five files in `public/video` are no longer referenced by anything:

| File | Size | What it is |
| --- | --- | --- |
| `hero-main.mp4` | 9.1 MB | The **previous hero** (`Cmb Hero Page Background Video 01.mp4`). This is the only copy left in the repo |
| `hero-main-poster.jpg` | 0.2 MB | Its poster frame |
| `0_Ship_Cargo.mp4` | 15 MB | 4K master from the rotation round |
| `v1.mp4` | 7 MB | 4K master |
| `v2.mp4` | 17 MB | 4K master |

**Anything in `public/` is deployed and publicly downloadable**, so that is
~48 MB of dead weight on every build — more than the live site's entire media
budget. They are left in place because they may be the only copies. Archive
them, then move them out:

```bash
mkdir -p media-source
mv public/video/{0_Ship_Cargo,v1,v2,hero-main}.mp4 media-source/
mv public/video/hero-main-poster.jpg media-source/
```

### Hero rotation

`hero.clips` in `src/lib/content.ts` currently holds **one** clip, which simply
loops. The player still supports a rotation: add entries to that array and
`RotatingBackgroundVideo` plays them in sequence with crossfades. Nothing else
needs to change.

It uses two stacked `<video>` elements: one plays while the other sits paused on
the *next* clip, already buffered. Swapping `src` on a single element instead
would tear down the decoder and show a black frame at every handoff. Only the
playing clip and the one queued behind it are ever fetched, so initial load does
not grow with the number of clips.

`npm run rotation` verifies playback starts, that every declared clip is shown
(or that a lone clip loops), that there is no gap at the handoff, and that
loading stays lazy.

### Loading discipline

Both video components decide at runtime whether to fetch anything at all:

- reduced motion → poster only, video never requested
- `Save-Data` or a 2G connection → poster only
- narrow viewport → the smaller encode
- scrolled out of view → paused, so it stops burning battery

The poster renders immediately and is never removed, so there is no flash and no
layout shift. Where a mobile variant is *different footage* rather than a
smaller encode — as the showreel now is — pass `mobilePoster` so the still and
the clip that fades in show the same scene.

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
