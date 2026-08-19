import Link from "next/link";
import { Mark } from "./Mark";
import { SITE, FOOTER_LINKS, COMPANY } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-border/60 py-16">
      <div className="mx-auto grid max-w-[var(--content-width)] gap-10 px-6 sm:px-8 md:grid-cols-[auto_1fr_auto] md:items-center">
        <Mark className="mark-hover h-12 w-12 text-border" />

        <p className="text-sm text-muted">
          {COMPANY.name} · Company no. {COMPANY.number} · {SITE.location}
        </p>

        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {FOOTER_LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="link-sweep text-muted">
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href={SITE.links.linkedin}
              target="_blank"
              rel="noopener"
              className="link-sweep text-muted"
            >
              LinkedIn
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
