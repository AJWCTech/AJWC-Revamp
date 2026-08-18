"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ASSETS } from "@/content/assets";
import type { WorkItem } from "@/content/site";

/* The signature moment: client sites sitting in 3D space, fading and
 * transforming into view on scroll.
 *
 * Built with CSS 3D transforms rather than WebGL, deliberately. These
 * cards carry real images, real headings and real links — inside a
 * canvas they would be unselectable, unreadable to a screen reader and
 * blurry on a high-DPI display. The perspective lives on the list, so
 * sibling cards share one vanishing point and the depth reads as one
 * space rather than each card tilting in its own private box.
 *
 * "Premium rather than gimmicky" is mostly restraint: a shallow tilt, a
 * short travel, a slow ease, and a stagger long enough to notice but
 * short enough not to wait for.
 */

gsap.registerPlugin(ScrollTrigger);

export function WorkCard({ item, index }: { item: WorkItem; index: number }) {
  const root = useRef<HTMLElement>(null);
  const asset = ASSETS[item.assetKey];

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    // Honoured here as well as in CSS: GSAP writes inline transforms that
    // would otherwise override a media query.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(el, { opacity: 1, y: 0, z: 0, rotateX: 0, scale: 1 });
      return;
    }

    // Mobile gets a plain fade — no perspective, no travel. Rotating a
    // full-width card on a small screen reads as a glitch, not a flourish.
    const mobile = window.matchMedia("(max-width: 767px)").matches;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        mobile
          ? { opacity: 0, y: 24 }
          : { opacity: 0, y: 90, z: -320, rotateX: 14, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          z: 0,
          rotateX: 0,
          scale: 1,
          duration: mobile ? 0.6 : 1.15,
          ease: "power3.out",
          delay: mobile ? 0 : index * 0.12,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [index]);

  return (
    <article ref={root} className="work-card">
      <a href={item.url ?? "#contact"} className="group block">
        <figure className="work-card__figure">
          <Image
            src={asset.path}
            alt={asset.alt}
            width={asset.width}
            height={asset.height}
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          />
        </figure>

        <div className="mt-6 flex items-baseline justify-between gap-4">
          <h3 className="text-xl text-text">{item.client}</h3>
          <span className="shrink-0 text-sm text-muted">{item.sector}</span>
        </div>

        <p className="mt-3 text-[0.9375rem]">{item.summary}</p>
        <p className="mt-3 text-[0.9375rem] text-text/80">{item.outcome}</p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {item.stack.map((s) => (
            <li
              key={s}
              className="rounded-pill border border-border px-3 py-1 text-xs text-muted"
            >
              {s}
            </li>
          ))}
        </ul>
      </a>
    </article>
  );
}
