import Link from "next/link";
import { Mark } from "./Mark";
import { MotionToggle } from "./MotionToggle";
import { ThemeToggle } from "./ThemeToggle";
import { SITE, FOOTER_LINKS, COMPANY } from "@/content/site";

/* Icons are inline SVG rather than <img>: they inherit currentColor, so
 * they follow the theme and the hover state without a second asset per
 * colour, and they cost no extra request. */

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM2.9 21.5h4.16V9.5H2.9v12ZM9.6 9.5h3.99v1.64h.06c.56-1.02 1.92-2.1 3.95-2.1 4.22 0 5 2.71 5 6.23v6.23h-4.15v-5.52c0-1.32-.03-3.02-1.9-3.02-1.9 0-2.19 1.44-2.19 2.93v5.61H9.6V9.5Z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-border/60 py-14">
      <div className="mx-auto flex max-w-[var(--content-width)] flex-col gap-10 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-5">
          <Mark className="mark-hover h-11 w-11 shrink-0 text-border" />
          <p className="text-sm text-muted">
            {COMPANY.name}
            <br />
            Company no. {COMPANY.number} · {SITE.location}
          </p>
        </div>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {FOOTER_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-sweep text-muted">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-6">
            <ThemeToggle />
            <MotionToggle />
          </div>

          <ul className="flex items-center gap-4">
            <li>
              <a
                href={SITE.links.github}
                target="_blank"
                rel="noopener"
                className="social-icon"
                aria-label="GitHub"
              >
                <GitHubIcon />
              </a>
            </li>
            <li>
              <a
                href={SITE.links.linkedin}
                target="_blank"
                rel="noopener"
                className="social-icon"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
