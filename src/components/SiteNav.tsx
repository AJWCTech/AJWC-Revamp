"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Mark } from "./Mark";
import { NAV } from "@/content/site";

/* Nav with a real mobile menu.
 *
 * The desktop list simply wrapping onto three lines on a phone was the
 * old behaviour and it was bad. Below the `sm` breakpoint the links
 * collapse behind a toggle instead.
 *
 * Accessibility bits that are easy to skip and matter here: the button
 * reports aria-expanded, Escape closes the menu and returns focus to the
 * button, and navigating closes it so the panel is never left open over
 * a new page.
 */

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  /* Close on navigation. Adjusted during render rather than in an
     effect: the menu being open is derived from "have we navigated
     since it was opened", and doing it in an effect would render the
     panel open over the new page for a frame first. */
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-border/50 bg-bg/80 backdrop-blur-md">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-[var(--content-width)] items-center justify-between gap-4 px-5 py-3 sm:px-8 sm:py-4"
      >
        <Link href="/" className="mark-hover flex shrink-0 items-center gap-3 text-text">
          <Mark className="h-7 w-7 text-brand" />
          <span className="font-display text-sm">Archie Cook</span>
        </Link>

        {/* Desktop */}
        <ul className="hidden items-center gap-7 text-sm lg:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={pathname.startsWith(item.href) ? "page" : undefined}
                className={`link-sweep ${
                  pathname.startsWith(item.href) ? "text-text" : "text-muted"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile trigger */}
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="nav-toggle grid place-items-center lg:hidden"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span aria-hidden="true" className={`nav-bars ${open ? "is-open" : ""}`}>
            <span />
            <span />
            <span />
          </span>
        </button>
      </nav>

      {/* Mobile panel. Kept in the DOM and hidden, so the open/close can
          animate and so the links stay in source order. */}
      <div id="mobile-nav" hidden={!open} className="lg:hidden">
        <ul className="border-t border-border/50 bg-bg/95 px-5 py-3">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={pathname.startsWith(item.href) ? "page" : undefined}
                className={`block border-b border-border/40 py-3 text-base ${
                  pathname.startsWith(item.href) ? "text-brand" : "text-text"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
