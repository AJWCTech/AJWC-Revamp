"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import Lenis from "lenis";

/* One scroll source of truth.
 *
 * Lenis drives the page, GSAP ScrollTrigger is told about it, and the 3D
 * scene reads the same progress value the DOM does. That shared value is
 * what stops the canvas and the HTML drifting apart — the failure mode
 * where the model has moved on but the text under it has not.
 */

type ScrollCtx = {
  /** 0..1 across the whole document. */
  progress: number;
  /** Index into SCENE_STATES, fractional between two states. */
  sceneIndex: number;
};

const Ctx = createContext<ScrollCtx>({ progress: 0, sceneIndex: 0 });

export const useScrollProgress = () => useContext(Ctx);

export function ScrollProvider({
  children,
  sectionCount,
  enabled,
}: {
  children: React.ReactNode;
  sectionCount: number;
  enabled: boolean;
}) {
  const [state, setState] = useState<ScrollCtx>({ progress: 0, sceneIndex: 0 });
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });

    const onScroll = ({ progress }: { progress: number }) => {
      setState({ progress, sceneIndex: progress * (sectionCount - 1) });
    };
    lenis.on("scroll", onScroll);

    const loop = (time: number) => {
      lenis.raf(time);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    /* Anchor links must go through Lenis. A native jump moves the page
       without Lenis emitting "scroll", so the 3D scene keeps the state
       it had before the jump while the DOM is somewhere else entirely —
       the mark stays at hero presence over the Work section. Routing
       clicks through scrollTo keeps the two in step. */
    const onAnchorClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]');
      if (!link) return;
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -72 });
    };
    document.addEventListener("click", onAnchorClick);

    // A page loaded with a hash already applied lands mid-document, so
    // seed the state from where we actually are rather than from zero.
    const seed = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      setState({ progress: p, sceneIndex: p * (sectionCount - 1) });
    };
    seed();

    return () => {
      cancelAnimationFrame(raf.current);
      document.removeEventListener("click", onAnchorClick);
      lenis.off("scroll", onScroll);
      lenis.destroy();
    };
  }, [enabled, sectionCount]);

  /* Reduced motion and no-WebGL still need a progress value for anything
     that reads it, but it comes from native scroll with no smoothing. */
  useEffect(() => {
    if (enabled) return;
    const onNative = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      setState({ progress: p, sceneIndex: p * (sectionCount - 1) });
    };
    onNative();
    window.addEventListener("scroll", onNative, { passive: true });
    return () => window.removeEventListener("scroll", onNative);
  }, [enabled, sectionCount]);

  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}
