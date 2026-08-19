"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mark } from "./Mark";
import { NAV } from "@/content/site";

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-border/50 bg-bg/70 backdrop-blur-md">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-[var(--content-width)] items-center justify-between gap-6 px-6 py-4 sm:px-8"
      >
        <Link href="/" className="mark-hover flex items-center gap-3 text-text">
          <Mark className="h-7 w-7 text-brand" />
          <span className="font-display text-sm">Archie Cook</span>
        </Link>

        <ul className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
          {NAV.map((item) => {
            // NAV never contains "/", so a prefix match is enough and
            // also lights the parent for nested routes like /cv/view.
            const active = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`link-sweep ${active ? "text-text" : "text-muted"}`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
