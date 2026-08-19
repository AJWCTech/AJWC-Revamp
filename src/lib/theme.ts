/* Theme preference: dark, light, or follow the OS.
 *
 * Applied as data-theme on <html>. The default is "system", so the site
 * follows prefers-color-scheme until someone states a preference.
 *
 * STORAGE NOTE: writes one localStorage key. Disclosed on the cookie
 * policy page alongside the motion preference — if you remove this
 * toggle, remove that disclosure too.
 */

export type Theme = "system" | "dark" | "light";

export const THEME_KEY = "ajwc-theme";

const listeners = new Set<() => void>();
let cached: Theme | null = null;

export function getTheme(): Theme {
  if (typeof window === "undefined") return "system";
  if (cached) return cached;
  try {
    const raw = window.localStorage.getItem(THEME_KEY);
    cached = raw === "dark" || raw === "light" ? raw : "system";
  } catch {
    cached = "system";
  }
  return cached;
}

/** What the visitor actually sees, resolving "system" against the OS. */
export function getResolvedTheme(): "dark" | "light" {
  const theme = getTheme();
  if (theme !== "system") return theme;
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function setTheme(value: Theme): void {
  cached = value;
  try {
    if (value === "system") window.localStorage.removeItem(THEME_KEY);
    else window.localStorage.setItem(THEME_KEY, value);
  } catch {
    // Preference still applies for this session even if it cannot persist.
  }
  applyTheme();
  listeners.forEach((fn) => fn());
}

/** Writes the attribute the CSS keys off. */
export function applyTheme(): void {
  if (typeof document === "undefined") return;
  const theme = getTheme();
  if (theme === "system") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", theme);
}

export function subscribeTheme(fn: () => void): () => void {
  listeners.add(fn);
  if (typeof window !== "undefined") {
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    mq.addEventListener("change", fn);
    return () => {
      listeners.delete(fn);
      mq.removeEventListener("change", fn);
    };
  }
  return () => {
    listeners.delete(fn);
  };
}
