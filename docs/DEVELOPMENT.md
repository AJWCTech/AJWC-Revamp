# Development

How this site is built, why it is built that way, and how to work on it
without breaking things that are easy to break.

**Written:** 19 August 2026

---

## Stack

| Layer | Choice | Note |
|---|---|---|
| Framework | Next.js 16.3.1, App Router | Turbopack. Route types are generated — see [Route types](#route-types). |
| Language | TypeScript 5 | `tsc --noEmit` must pass. |
| UI | React 19.2 | |
| Styling | Tailwind v4 | **CSS-first. There is no `tailwind.config.js`.** |
| 3D | three 0.185 + React Three Fiber 9 + drei 10 | |
| Motion | GSAP 3 + ScrollTrigger, Lenis | |
| Tooling | Python 3.14 + Pillow + scikit-image | Logo generation only, not a runtime dependency. |

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # writes out/ (static export)
npx tsc --noEmit
npx eslint src
```

---

## Architecture

### One canvas, mounted once

`SceneHost` lives in the **root layout**, not in a page. That is
deliberate: the WebGL canvas and the scroll provider survive navigation
between routes instead of being torn down and rebuilt every time someone
clicks a link. A canvas that remounts per route means a new WebGL context
per route, which is both slow and a good way to hit the browser's context
limit.

### Scene state is data, not code

`SCENE_STATES` in `src/content/site.ts` declares, per section: camera
position, look-at target, how present the mark should be, and how far it
has spun. `Scene.tsx` interpolates between entries.

**No component moves the camera.** If you find yourself reaching for
`camera.position` inside a section component, the answer is a new entry in
`SCENE_STATES`.

> ⚠️ **Known limitation.** The scene map assumes the homepage's section
> order. On inner pages, scroll progress still drives `sceneIndex`, so the
> camera moves through states that do not correspond to anything on that
> page. It looks fine — the mark drifts and recedes — but it is not
> meaningful. If inner pages ever need their own choreography, give each
> route its own state list rather than adding conditionals here.

### Capability detection lives in one place

`src/lib/capabilities.ts` is the single answer to "should the 3D run".
Everything branches on `caps.scene3d`. The inputs:

- `prefers-reduced-motion: reduce`
- viewport under 768px
- WebGL availability
- a low-power heuristic (core count, software-renderer strings)
- **the visitor's explicit preference**, which overrides all of the above
  in both directions — except that "on" still cannot run without WebGL

It is exposed as a `useSyncExternalStore` store rather than copied into
React state in an effect, so a visitor toggling reduce-motion mid-session
gets the right treatment without a reload. ESLint's
`react-hooks/set-state-in-effect` rule will catch you if you regress this.

### Fallbacks are a first-class path, not an error state

When `scene3d` is false, `StaticScene` renders the real mark as static
SVG. It is positioned to match where the 3D mark sits, so the composition
does not change between paths — only the movement does.

> This replaced a generated placeholder image that printed its own pixel
> dimensions across the hero. Worth remembering how many people land on
> this path: reduce-motion is on by default on plenty of Windows
> machines, every phone gets it, and so does anything without WebGL. The
> fallback is not a rare edge case.

---

## The logo

**One source.** `scripts/trace-logo.py` traces the supplied artwork:
threshold to a binary mask, extract iso-contours, simplify with
Douglas-Peucker, emit SVG. Favicons rasterise from the *same mask*, so
vector and raster cannot drift.

```bash
py scripts/trace-logo.py
```

Outputs `public/logo/*.svg` plus the whole favicon set.

Two rules for any replacement mark:

1. **Filled closed paths, not strokes.** `ExtrudeGeometry` consumes
   shapes. A stroked mark must be outlined first.
2. **`currentColor` does not resolve inside an SVG loaded via `<img>`** —
   it silently renders black. That is why `Mark.tsx` inlines the path
   rather than pointing an `<img>` at the file. If you ever see the logo
   render black, this is why.

`fill-rule="evenodd"` is load-bearing: it hollows out the counters inside
the letterforms.

There is a second, simplified mark (`ajwc-mark-16.svg`) for 16–32px.
Below ~24px the full monogram's detail falls under a pixel. Shipping one
mark scaled down is what produces a smudged favicon.

---

## Design tokens

`src/app/design-tokens.css` is the **single source of truth**. No hex
belongs anywhere else. `globals.css` maps tokens into Tailwind's `@theme`
so `bg-bg-raised`, `text-muted` and `font-display` resolve to the same
values raw CSS uses.

Light theme redefines only ground and text tokens — every component reads
through them, so nothing else needs a light variant.

**The brand colour changes between themes, and it has to.** `#20C2D2` is
10.3:1 on near-black and 1.9:1 on white. Light mode uses a deepened cyan
for anything carrying text. If you change the brand colour, measure both
grounds before shipping.

---

## Conventions worth keeping

**Content lives in `src/content/`.** Copy, work items, services, scene
states, the asset manifest. Components read from there. This is why the
site can be restructured without touching component internals.

**The asset manifest is the only place asset paths and dimensions live.**
Swapping a placeholder for a real asset is a one-line edit in
`src/content/assets.ts` — change `path`, set `placeholder: false`. Because
width and height come from the manifest and go to `next/image`, nothing
shifts when the real asset lands.

**`TODO: confirm` marks anything I could not verify.** Facts I did not
have were flagged, not invented.

```bash
grep -rn "TODO: confirm" src/
```

**Legal pages carry real, checked wording.** `/privacy`, `/terms` and
`/cookies` were copied verbatim from the live site, company number and
ICO registration included. They describe actual behaviour. If the site's
data handling changes, those pages change *first*. Do not reword them to
suit the design.

> This already bit once: adding the theme and motion toggles introduced
> two localStorage keys, and the cookie policy had promised *no* browser
> storage. The policy was amended in the same commit. Anything that
> stores, sends or sets something needs the same treatment.

---

## Traps

### Tailwind specificity

Custom classes in `globals.css` are defined **after** `@import
"tailwindcss"`, so at equal specificity **they beat utilities**.

This caused a real bug: `.nav-toggle { display: grid }` beat `lg:hidden`,
so the hamburger showed on desktop next to the full nav. Fix was to set no
`display` in the custom class and apply it with utilities instead.

**Rule: never set a property in a custom class that you also want to
control with a utility.** Layout and display belong in utilities;
component-specific appearance belongs in the custom class.

### Route types

`PageProps<"/projects/[area]">` and `LayoutProps<"/">` are **generated**
into `.next/types` by a build. On a clean checkout `tsc --noEmit` fails
with "Cannot find name 'LayoutProps'" until you have run `npm run build`
or `npm run dev` once. Not a bug; run a build first.

### Static export needs `force-static`

`robots.ts`, `sitemap.ts` and `opengraph-image.tsx` each need
`export const dynamic = "force-static"` or `output: "export"` fails.
Already applied. If you add another metadata route, it needs the same.

### Satori counts JSX children

In `opengraph-image.tsx`, `{a} · {b}` is three child nodes and fails with
"Expected `<div>` to have explicit display: flex". Use a single template
literal instead. Already applied.

### Heredocs

Bash heredocs hang in this environment. Write files with an editor, not
`cat <<EOF`.

---

## Verifying visually

The in-app browser pane cannot take screenshots here and the review
browser has reduce-motion enabled, so neither shows the 3D by default.

Two ways round it:

- **Dev-only URL flags:** `?scene=force` runs the 3D regardless of
  capability checks; `?scene=off` forces the fallback. Both are stripped
  from production builds, so a visitor's motion preference can never be
  overridden by a URL.
- **Headless capture:** `AJWC Portfolio/src/capture.ps1` drives Edge over
  CDP. `msedge --headless --screenshot` fires before a JS app renders;
  `--virtual-time-budget` writes no file at all. Use the script.

  ```powershell
  & "..\AJWC Portfolio\src\capture.ps1" -Url "http://localhost:3000/?scene=force" -Out shot.png -WaitMs 10000 -Width 1440 -Height 900
  ```

**Render budget**, live in dev:

```js
window.__sceneStats
// { drawCalls, triangles, geometries, textures, programs }
```

Last measured: **7 draw calls, 408 triangles** against a budget of 100
and 150,000.

---

## Known issues

| Issue | Notes |
|---|---|
| Mark bleeds over the Work section on hash loads | Two contributing causes fixed (an opacity floor of 0.35 made `markPresence: 0.16` render at 45%; anchor jumps did not emit a Lenis scroll event). Improved, not solved. Needs a proper diagnostic pass. |
| No preloader | The brief asked for a logo-draw loading sequence. Not built. |
| No pinned sections | ScrollTrigger pinning on Work and Services. Not built. |
| `showreel.mp4` missing | ffmpeg is not installed on this machine; only the poster exists. Drop the slot or install ffmpeg. |
| `frameloop="demand"` not used | The brief asked for it *and* for ambient idle motion; those contradict. The scene suspends on tab-hide instead. |
| LCP unmeasured on mobile 4G | Mobile takes the static path so it should be fine, but this has not been proven. |
| Custom cursor cut | Deliberate. It was the most fashionable item on the list and fought hardest with "focus must survive the cursor". |

---

## Where things are

```
scripts/
  trace-logo.py          traces the artwork -> SVG set + favicons
  build-placeholders.py  generates labelled placeholder images
src/app/
  layout.tsx             chrome, fonts, metadata, theme init script
  design-tokens.css      the only place hex values belong
  globals.css            token -> Tailwind mapping, component CSS
  page.tsx               homepage
  work|services|about|projects|university|cv|contact|privacy|terms|cookies/
  opengraph-image.tsx    generated OG card
src/components/
  Scene, LogoMesh, ApertureMesh      the 3D
  SceneHost, ScrollProvider          canvas lifecycle and scroll
  StaticScene                        the fallback
  SiteNav, SiteFooter, PageShell     chrome
  WorkCard, Reveal                   the motion primitives
  ThemeToggle, MotionToggle          preferences
src/content/               copy, work, services, scene states, assets
src/lib/                   capabilities, theme, motion preference
public/Assets/             CV files and the 16 archived module pages
public/contact.php         original hardened form handler
```
