"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* Considered motion on every section, from one place.
 *
 * A single reveal primitive rather than bespoke animation per section:
 * consistency in timing and easing is most of what separates motion that
 * feels designed from motion that feels busy. Everything here uses the
 * same curve and the same short travel; only the delay varies.
 *
 * Content is visible by default in the markup and only hidden once JS
 * confirms it will animate it back in. That ordering matters — hiding in
 * CSS and revealing with JS means anyone with a script failure gets a
 * blank page.
 */

gsap.registerPlugin(ScrollTrigger);

/* Deliberately a narrow union rather than ElementType. A fully generic
   polymorphic `as` cannot type its own ref without a lot of ceremony,
   and these are the only three wrappers the layout actually needs. */
type RevealTag = "div" | "li" | "section";

export function Reveal({
  children,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  as?: RevealTag;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [delay]);

  /* Written out per tag rather than via createElement: passing a ref
     through createElement trips react-hooks/refs, because the linter
     cannot prove the ref is not read during render. Three branches is a
     small price for keeping that check switched on. */
  if (as === "li") {
    return (
      <li ref={ref as React.RefObject<HTMLLIElement>} className="reveal">
        {children}
      </li>
    );
  }
  if (as === "section") {
    return (
      <section ref={ref as React.RefObject<HTMLElement>} className="reveal">
        {children}
      </section>
    );
  }
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="reveal">
      {children}
    </div>
  );
}
