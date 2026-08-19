/* What this device can actually be asked to do.
 *
 * All three fallback paths in the brief are decided here rather than
 * scattered through components, so there is exactly one answer to
 * "should the 3D run" and every consumer agrees with it.
 */

import { getMotionPreference, subscribeMotion } from "./motion-preference";

export type Capabilities = {
  reducedMotion: boolean;
  smallViewport: boolean;
  webgl: boolean;
  lowPower: boolean;
  /** The single flag components should branch on. */
  scene3d: boolean;
};


function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") ?? c.getContext("webgl"));
  } catch {
    return false;
  }
}

/* Integrated GPUs and software renderers report themselves through the
 * unmasked renderer string. This is a heuristic, not a guarantee — which
 * is why it only downgrades, never blocks. */
function isLowPower(): boolean {
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) return true;
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") ?? c.getContext("webgl");
    if (!gl) return true;
    const ext = (gl as WebGLRenderingContext).getExtension("WEBGL_debug_renderer_info");
    if (!ext) return false;
    const r = String(
      (gl as WebGLRenderingContext).getParameter(ext.UNMASKED_RENDERER_WEBGL),
    ).toLowerCase();
    return /swiftshader|llvmpipe|software|basic render/.test(r);
  } catch {
    return false;
  }
}

/* --- store ---------------------------------------------------------
 * Device capability is external state, so it is exposed as a subscribable
 * store rather than copied into React state inside an effect. The
 * snapshot is cached because useSyncExternalStore compares by reference —
 * returning a fresh object each call would loop forever.
 */

let snapshot: Capabilities | null = null;

const SERVER_SNAPSHOT: Capabilities = {
  reducedMotion: false,
  smallViewport: false,
  webgl: false,
  lowPower: false,
  scene3d: false,
};

export function getSnapshot(): Capabilities {
  snapshot ??= detect();
  return snapshot;
}

export function getServerSnapshot(): Capabilities {
  return SERVER_SNAPSHOT;
}

export function subscribe(onChange: () => void): () => void {
  const queries = [
    window.matchMedia("(prefers-reduced-motion: reduce)"),
    window.matchMedia("(max-width: 767px)"),
  ];
  const handler = () => {
    snapshot = detect();
    onChange();
  };
  queries.forEach((q) => q.addEventListener("change", handler));
  const unsubMotion = subscribeMotion(handler);

  return () => {
    queries.forEach((q) => q.removeEventListener("change", handler));
    unsubMotion();
  };
}

export function detect(): Capabilities {
  if (typeof window === "undefined") {
    // SSR: assume the cautious path so the server never renders a canvas.
    return {
      reducedMotion: false,
      smallViewport: false,
      webgl: false,
      lowPower: false,
      scene3d: false,
    };
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const smallViewport = window.matchMedia("(max-width: 767px)").matches;
  const webgl = hasWebGL();
  const lowPower = isLowPower();

  /* Development override: ?scene=force runs the 3D path regardless of the
     checks above, and ?scene=off forces the static fallback.
     Both exist because every automatable browser on this machine trips a
     fallback — headless reports a software renderer, and the review
     browser has reduce-motion on — so without this the 3D path could
     only ever be verified by hand. Disabled in production builds so a
     visitor's motion preference can never be overridden by a URL. */
  if (process.env.NODE_ENV !== "production") {
    const override = new URLSearchParams(window.location.search).get("scene");
    if (override === "force") {
      return { reducedMotion, smallViewport, webgl, lowPower, scene3d: webgl };
    }
    if (override === "off") {
      return { reducedMotion, smallViewport, webgl, lowPower, scene3d: false };
    }
  }

  /* An explicit visitor preference beats the inferred defaults, in both
     directions. "on" still cannot run without WebGL — a preference is
     not a graphics card. */
  const preference = getMotionPreference();
  if (preference === "on") {
    return { reducedMotion, smallViewport, webgl, lowPower, scene3d: webgl };
  }
  if (preference === "off") {
    return { reducedMotion, smallViewport, webgl, lowPower, scene3d: false };
  }

  /* smallViewport no longer blocks the scene.
   *
   * It used to, on the "degrade on mobile" principle. But the scene is 7
   * draw calls and 408 triangles — a 2015 phone would not notice it, and
   * blocking it meant the mark, which is the site's signature, was absent
   * from the device most visitors arrive on.
   *
   * The guards that remain are the ones that describe a real inability or
   * a real preference: no WebGL, a software renderer or very low core
   * count, or the visitor asking for reduced motion. smallViewport is
   * still reported, and LogoMesh uses it to lay the scene out for a
   * portrait screen rather than to switch it off. */
  return {
    reducedMotion,
    smallViewport,
    webgl,
    lowPower,
    scene3d: webgl && !reducedMotion && !lowPower,
  };
}
