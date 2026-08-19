/* Visitor motion preference, layered over the OS setting.
 *
 * Default is "system", which follows prefers-reduced-motion exactly as
 * before — so the accessible behaviour is what happens if nobody touches
 * anything. The override exists because respecting the OS setting is
 * right as a default and wrong as a prison: plenty of people run Windows
 * with animations off for the taskbar, not because motion on a website
 * hurts them, and they should be able to say so.
 *
 * "on" overrides reduce-motion and the small-viewport rule, but still
 * requires WebGL — a preference cannot conjure a GPU.
 *
 * STORAGE NOTE: this writes one key to localStorage. The published
 * cookie policy previously stated the site used no browser storage at
 * all, so that page has been amended to disclose this. If you remove the
 * toggle, revert that wording too.
 */

export type MotionPreference = "system" | "on" | "off";

const KEY = "ajwc-motion";

const listeners = new Set<() => void>();
let cached: MotionPreference | null = null;

export function getMotionPreference(): MotionPreference {
  if (typeof window === "undefined") return "system";
  if (cached) return cached;
  try {
    const raw = window.localStorage.getItem(KEY);
    cached = raw === "on" || raw === "off" ? raw : "system";
  } catch {
    // Private browsing and locked-down profiles can throw on access.
    cached = "system";
  }
  return cached;
}

export function setMotionPreference(value: MotionPreference): void {
  cached = value;
  try {
    if (value === "system") window.localStorage.removeItem(KEY);
    else window.localStorage.setItem(KEY, value);
  } catch {
    // Preference still applies for this session even if it cannot persist.
  }
  listeners.forEach((fn) => fn());
}

export function subscribeMotion(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Called by capabilities.subscribe so a change re-runs detection. */
export function notifyMotionChange(): void {
  listeners.forEach((fn) => fn());
}
