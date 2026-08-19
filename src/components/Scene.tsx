"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { usePathname } from "next/navigation";
import { SCENE_STATES } from "@/content/site";
import { useScrollProgress } from "./ScrollProvider";
import { LogoMesh } from "./LogoMesh";
import { ApertureMesh } from "./ApertureMesh";
import { beginDrag, endDrag, addDrag, isDragging } from "@/lib/drag-spin";

/* One canvas, fixed behind the DOM, mounted once for the life of the page.
 *
 * Camera and scene state are declared as data in SCENE_STATES and
 * interpolated here. No component anywhere calls the camera directly —
 * that is what keeps the choreography editable in one place instead of
 * scattered through section components.
 */

function lerpVec(
  out: THREE.Vector3,
  a: readonly [number, number, number],
  b: readonly [number, number, number],
  t: number,
) {
  out.set(
    THREE.MathUtils.lerp(a[0], b[0], t),
    THREE.MathUtils.lerp(a[1], b[1], t),
    THREE.MathUtils.lerp(a[2], b[2], t),
  );
  return out;
}

/* Dev-only: exposes three's own render stats so the budget in the plan
   (under 100 draw calls, under 150k triangles) can be measured rather
   than assumed. Stripped from production builds. */
function BudgetProbe() {
  const { gl, camera } = useThree();
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const w = window as unknown as { __sceneStats?: unknown };
    const id = setInterval(() => {
      w.__sceneStats = {
        drawCalls: gl.info.render.calls,
        triangles: gl.info.render.triangles,
        geometries: gl.info.memory.geometries,
        textures: gl.info.memory.textures,
        programs: gl.info.programs?.length ?? 0,
        // Camera position, so "does the scene actually travel as I
        // scroll this page" is measurable rather than a judgement call.
        camera: {
          x: +camera.position.x.toFixed(3),
          y: +camera.position.y.toFixed(3),
          z: +camera.position.z.toFixed(3),
        },
      };
    }, 250);
    return () => clearInterval(id);
  }, [gl, camera]);
  return null;
}

/* Inner pages get their own two-point camera travel, driven by that
   page's own scroll.

   A single fixed state was the first attempt and it was too still: with
   the camera pinned, the only movement left was the pointer's sideways
   lean and the idle spin, so the mark never drifted down the screen the
   way it does on the homepage. These two states give the same
   scroll-follows-you feel without borrowing the homepage's section
   choreography, which means nothing on /privacy. */
const INNER_PAGE_FROM = {
  camera: [0.6, 0.75, 4.4] as [number, number, number],
  target: [0, 0.25, 0] as [number, number, number],
  markPresence: 0.55,
  markSpin: 0.35,
};

const INNER_PAGE_TO = {
  camera: [-0.5, -0.85, 5.0] as [number, number, number],
  target: [0, -0.3, 0] as [number, number, number],
  markPresence: 0.4,
  markSpin: 1.5,
};



function Rig() {
  const { camera } = useThree();
  const { sceneIndex, progress } = useScrollProgress();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const camPos = useRef(new THREE.Vector3(0, 0, 4.2));
  const target = useRef(new THREE.Vector3());

  const i = Math.max(0, Math.min(SCENE_STATES.length - 1, Math.floor(sceneIndex)));
  const j = Math.min(SCENE_STATES.length - 1, i + 1);

  /* Homepage: step through the section states. Inner pages: one smooth
     sweep across the page's own scroll, so the mark travels vertically
     there too rather than sitting at a fixed height. */
  const t = isHome ? sceneIndex - i : progress;
  const from = isHome ? SCENE_STATES[i] : INNER_PAGE_FROM;
  const to = isHome ? SCENE_STATES[j] : INNER_PAGE_TO;

  useFrame(() => {
    lerpVec(camPos.current, from.camera, to.camera, t);
    lerpVec(target.current, from.target, to.target, t);
    // Damped rather than snapped, so a fast scroll does not whip the camera.
    camera.position.lerp(camPos.current, 0.08);
    camera.lookAt(target.current);
  });

  const presence = THREE.MathUtils.lerp(from.markPresence, to.markPresence, t);
  const spin = THREE.MathUtils.lerp(from.markSpin, to.markSpin, t);

  return (
    <>
      {/* Ambient form sits behind and stays present when the mark recedes,
          so a section without the logo is not an empty scene. */}
      <ApertureMesh presence={0.55 + (1 - presence) * 0.45} />
      <LogoMesh presence={presence} spin={spin} />
    </>
  );
}

export default function Scene() {
  const [visible, setVisible] = useState(true);

  /* Drag-to-spin. The state itself lives in lib/drag-spin as a module
     singleton: the DOM listeners are here and the per-frame integration
     is in LogoMesh, so passing it as a prop meant one of them mutating
     an object it received. */
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    let lastX = 0;
    let activeId: number | null = null;

    const onDown = (e: PointerEvent) => {
      activeId = e.pointerId;
      lastX = e.clientX;
      beginDrag();
      el.setPointerCapture(e.pointerId);
    };

    const onMove = (e: PointerEvent) => {
      if (!isDragging() || e.pointerId !== activeId) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      // Feeds velocity rather than setting rotation, so a flick carries
      // momentum and a slow drag tracks the hand.
      addDrag(dx);
    };

    const onUp = (e: PointerEvent) => {
      if (e.pointerId !== activeId) return;
      endDrag();
      activeId = null;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);

    // The scene has ambient idle motion, so it is never truly idle and
    // frameloop="demand" would freeze it. Suspending on tab-hide is the
    // honest version of that optimisation.
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div className="scene-canvas" aria-hidden="true" ref={host}>
      <Canvas
        dpr={[1, 2]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0, 4.2], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 5]} intensity={1.6} />
        <directionalLight position={[-5, -2, 3]} intensity={0.5} color="#20C2D2" />
        <BudgetProbe />
        <Suspense fallback={null}>
          <Rig />
        </Suspense>
      </Canvas>
    </div>
  );
}
