/* The AJWC monogram, inlined.
 *
 * Inline rather than <img src="…svg"> because currentColor does not
 * resolve inside an SVG loaded as an image — it silently renders black.
 * Inlining is what lets the mark inherit text colour, so the nav, the
 * footer and the OG card all use one component at different colours.
 *
 * The path is traced from the supplied artwork by scripts/trace-logo.py.
 * If the artwork changes, re-run that script and paste the `d` from
 * public/logo/ajwc-mark-mono.svg here.
 *
 * fill-rule="evenodd" is load-bearing: it is what hollows out the
 * counters inside the letterforms.
 */

export const MARK_PATH =
  "M24.62 58.96 5.10 37.16 8.41 32.42 11.29 35.42 25.40 19.75 15.01 19.69 3.96 35.90 0.18 31.88 0.06 31.40 21.01 0.60 32.78 0.60 32.84 23.83 27.14 30.26 26.96 30.20 26.90 26.66 15.07 39.80 17.89 42.87 33.50 25.58 33.80 25.64 37.40 29.84 21.79 47.13 23.47 49.29 24.62 50.43 40.35 33.02 44.13 37.28 24.62 58.96Z M60.28 34.58 45.27 34.58 35.36 23.47 39.14 19.09 47.91 28.82 55.77 28.76 36.08 6.54 34.52 6.30 34.58 0.60 38.42 0.60 63.34 28.52 63.70 29.00 63.58 29.48 60.28 34.58Z M26.96 13.87 26.96 6.42 24.02 6.36 18.91 13.87 26.96 13.87Z M47.55 63.28 30.02 63.28 29.96 59.02 48.63 38.54 63.76 38.54 63.82 45.45 60.88 48.63 53.19 48.63 56.86 44.37 51.15 44.31 39.20 57.34 39.26 57.52 44.91 57.52 47.19 55.11 54.75 55.11 47.55 63.28Z";

export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      className={className}
      role="img"
      aria-label="AJWC Tech Consulting"
    >
      <path fillRule="evenodd" d={MARK_PATH} />
    </svg>
  );
}
