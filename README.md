# Archie Cook — portfolio

Next.js 16 (App Router) · React 19 · React Three Fiber · GSAP · Lenis ·
Tailwind v4.

Dark, type-led, one persistent WebGL canvas behind the whole page with
the AJWC mark as the signature object.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

### Development-only URL flags

Every automatable browser on this machine trips one of the 3D fallbacks —
headless Edge reports a software renderer, and the review browser has
`prefers-reduced-motion: reduce` set — so the 3D path needs a way to be
forced for testing.

| URL | Effect |
|---|---|
| `?scene=force` | Run the 3D regardless of capability checks |
| `?scene=off` | Force the static fallback |

Both are stripped from production builds, so a visitor's motion
preference can never be overridden by a URL.

To read the live render budget while the scene is running:

```js
window.__sceneStats
// { drawCalls, triangles, geometries, textures, programs }
```

Measured on the current scene: **7 draw calls, 408 triangles** against a
budget of 100 and 150,000.

## Swapping a placeholder for a real asset

1. Drop the real file into `public/`.
2. In `src/content/assets.ts`, change that entry's `path` and set
   `placeholder: false`.

That is the whole change. Components only ever read the manifest, and
`width`/`height` come from it too, so nothing shifts when the real asset
arrives. See `PLACEHOLDERS.md` for the outstanding list.

## Swapping the logo

The mark is **generated**, not hand-drawn, so its geometry has one source:

```bash
py scripts/build-logo.py
```

That script emits everything from the same maths:

- `public/logo/ajwc-mark.svg` — full mark
- `public/logo/ajwc-mark-mono.svg` — flat single colour
- `public/logo/ajwc-mark-knockout.svg` — white, for use over brand colour
- `public/logo/ajwc-mark-16.svg` — simplified, for small sizes
- `public/favicon.ico`, `favicon-16/32.png`, `apple-touch-icon.png`,
  `icon-192/512.png`, `icon-maskable-512.png`

To retune the mark, change the constants at the top of the script —
`R_FRAME_OUT`, `BLADE_PAD`, `BLADE_TWIST` and so on — and re-run. To
replace it entirely, put a new SVG at `public/logo/ajwc-mark.svg` and the
3D follows automatically, because `LogoMesh` extrudes whatever is there.

Two constraints on any replacement mark:

- **It must be filled closed paths, not strokes.** `ExtrudeGeometry`
  consumes shapes; a stroked mark has to be outlined first.
- **`currentColor` does not resolve inside an SVG loaded via `<img>`.**
  The mono variant must be inlined (as it is in the nav), or it renders
  black.

## Adding a section

1. Add an entry to `SCENE_STATES` in `src/content/site.ts` with its
   camera position, look-at target, and how present the mark should be.
2. Add the matching `<section id="…">` in `src/app/page.tsx`.
3. Add a nav entry to `NAV` if it should be linkable.

Nothing else. Components never move the camera themselves — `Scene.tsx`
interpolates between the declared states, which is what keeps the
choreography editable in one place instead of scattered across sections.

## Design tokens

`src/app/design-tokens.css` is the single source of truth for every brand
value. `globals.css` maps them into Tailwind v4's `@theme`, so
`bg-bg-raised`, `text-muted` and `font-display` resolve to the same
values the raw CSS uses.

Tailwind v4 is CSS-first — **there is no `tailwind.config.js`**.

No hex may appear outside the token file. The brand ramp is sampled from
the mark itself; if the mark changes colour, resample and update the
tokens rather than picking a value by eye.

## Fallbacks

Decided in one place, `src/lib/capabilities.ts`, so every consumer agrees:

| Condition | Behaviour |
|---|---|
| `prefers-reduced-motion: reduce` | No scene, no smooth scroll, static poster. Fully usable. |
| Viewport below 768px | Static poster instead of the scene |
| No WebGL, or a software renderer | Static poster |

`three` and R3F are dynamically imported, so on any fallback path that
bundle is never fetched at all.

## Pages

Multi-page, mirroring the original site rather than collapsing it into one
scroll. Nav and footer live in the root layout, and the WebGL canvas is
mounted there too, so the 3D survives navigation instead of being torn
down and rebuilt per route.

| Route | Was |
|---|---|
| `/` | `index.html` |
| `/work` | `client-work.html` |
| `/services` | new |
| `/projects` | `Projects.html` |
| `/projects/[area]` | `web-dev-`, `app-development-`, `network-admin-`, `presentation-videos-projects.html` |
| `/about` | new, absorbing the old home page's about section |
| `/university` | `university-projects.html` |
| `/cv`, `/cv/view` | `cv.html`, `view.html` |
| `/contact` | `Contact.html` |
| `/privacy`, `/terms`, `/cookies` | same |
| `not-found` | `404.html` |

The 16 university module pages are passed through `public/Assets/Uni Work
Pages/` untouched, so their existing URLs keep working. They keep their
original styling — they are an archive, not part of the redesign.

⚠️ **The contact form posts to `contact.php`**, the original hardened
handler (honeypot, per-IP rate limit, same-origin check), passed through
`public/`. That only runs on an Apache/PHP host. If this is deployed to
Vercel or any static host without PHP, the form silently 404s and needs
replacing with a route handler.

## Legal pages

`/privacy`, `/terms` and `/cookies` carry wording and company details
copied verbatim from the live site, including the real company number,
ICO registration and registered office. They describe actual behaviour —
if the site's cookie or data handling changes, those pages change first.
Do not reword them to suit the design.

## Project layout

```
scripts/          build-logo.py, build-placeholders.py
src/app/          layout, page, design-tokens.css, sitemap, robots, OG image
src/components/   Scene, LogoMesh, ScrollProvider, SceneHost, JsonLd
src/content/      site.ts (facts, copy, scene map), assets.ts (manifest)
src/lib/          capabilities.ts
public/logo/      generated mark set
public/work/      real client screenshots
public/placeholders/  generated placeholders
```
