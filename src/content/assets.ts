/* The asset manifest — the only place any asset path or dimension lives.
 *
 * Components read from here and nowhere else. Swapping a placeholder for
 * a real asset is a one-line edit: change `path` and flip `placeholder`
 * to false. Because width and height are declared here and passed to
 * next/image, the layout does not shift when that swap happens.
 *
 * Regenerate the placeholder files with: py scripts/build-placeholders.py
 */

export type ImageAsset = {
  kind: "image";
  path: string;
  width: number;
  height: number;
  alt: string;
  placeholder: boolean;
  /** What this slot should eventually show. Feeds PLACEHOLDERS.md. */
  brief: string;
};

export type VideoAsset = {
  kind: "video";
  path: string;
  poster: string;
  width: number;
  height: number;
  placeholder: boolean;
  brief: string;
};

export type ModelAsset = {
  kind: "model";
  path: string;
  /** Intended bounding box in scene units, so swapping the GLB later
   *  cannot break the composition around it. */
  bbox: [number, number, number];
  placeholder: boolean;
  brief: string;
};

export type Asset = ImageAsset | VideoAsset | ModelAsset;

export const ASSETS = {
  /* --- real already --------------------------------------------------
     These three are genuine screenshots carried over from the current
     site. They need no generation pass. */
  "work-kritikal": {
    kind: "image",
    path: "/work/kritikal-800w.jpg",
    width: 800,
    height: 464,
    alt: "The Kritikal Soundsystem website, showing the hire catalogue",
    placeholder: false,
    brief: "Real screenshot — Kritikal Soundsystem, Bristol audio hire.",
  },
  "work-umbra": {
    kind: "image",
    path: "/work/umbra-800w.jpg",
    width: 800,
    height: 464,
    alt: "The Umbra artist website, showing the eclipse shader hero",
    placeholder: false,
    brief: "Real screenshot — Umbra, artist site with a WebGL eclipse hero.",
  },
  "work-white-phoenix": {
    kind: "image",
    path: "/work/white-phoenix-800w.jpg",
    width: 800,
    height: 464,
    alt: "The White Phoenix website, showing the Oracle consultancy landing page",
    placeholder: false,
    brief: "Real screenshot — White Phoenix, Oracle Fusion consultancy.",
  },

  /* --- placeholders --------------------------------------------------- */
  /* UNUSED as of the StaticScene change. The fallback for reduced-motion,
     mobile and no-WebGL is now the real mark rendered as static SVG
     (see components/StaticScene.tsx), which needs no asset and cannot
     show placeholder text to a visitor. Kept here only in case a
     photographic hero backdrop is wanted later; delete it otherwise. */
  "hero-poster": {
    kind: "image",
    path: "/placeholders/hero-poster.png",
    width: 1920,
    height: 1080,
    alt: "",
    placeholder: true,
    brief: "Currently unused. The 3D fallback is StaticScene, not an image.",
  },
  "portrait": {
    kind: "image",
    path: "/placeholders/portrait.png",
    width: 800,
    height: 1000,
    alt: "Archie Cook",
    placeholder: true,
    brief: "Portrait photograph. Dark, side-lit, matching the site ground.",
  },
  "security-lab": {
    kind: "image",
    path: "/placeholders/security-lab.png",
    width: 1200,
    height: 800,
    alt: "",
    placeholder: true,
    brief:
      "Supporting image for the security section. TODO: confirm what this should be — a lab setup, a terminal capture, or a certification badge wall.",
  },
  "showreel": {
    kind: "video",
    path: "/placeholders/showreel.mp4",
    poster: "/placeholders/showreel-poster.png",
    width: 1280,
    height: 720,
    placeholder: true,
    brief:
      "Short muted loop. Candidate content: screen capture of the three client sites being scrolled.",
  },

  /* --- 3D ------------------------------------------------------------
     The mark is real from day one; it is generated from the same
     geometry as the SVG, so there is no GLB to swap. */
  "logo-mark": {
    kind: "model",
    path: "/logo/ajwc-mark.svg",
    bbox: [2, 2, 0.35],
    placeholder: false,
    brief: "Extruded from the SVG paths at runtime via SVGLoader.",
  },
} as const satisfies Record<string, Asset>;

export type AssetKey = keyof typeof ASSETS;

export function asset<K extends AssetKey>(key: K): (typeof ASSETS)[K] {
  return ASSETS[key];
}
