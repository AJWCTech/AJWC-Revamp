"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SCENE_STATES } from "@/content/site";
import { useScrollProgress } from "./ScrollProvider";
import { LogoMesh } from "./LogoMesh";
import { ApertureMesh } from "./ApertureMesh";
import { beginDrag, endDrag, addDrag, isDragging, setPointerX } from "@/lib/drag-spin";

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



function Rig() {
  const { camera } = useThree();
  const { sceneIndex } = useScrollProgress();
  const camPos = useRef(new THREE.Vector3(0, 0, 4.2));
  const target = useRef(new THREE.Vector3());

  /* EVERY page runs the full choreography, not just the homepage.
   *
   * Inner pages briefly had their own two-point sweep, on the reasoning
   * that SCENE_STATES describes the homepage's sections and means
   * nothing on /privacy. True in principle, but it read as the mark
   * simply sinking down the screen while the homepage got the good
   * version — so the states are now treated as an abstract camera path
   * that any page's scroll can drive, rather than as section markers.
   *
   * sceneIndex is scroll progress scaled across the states, so a short
   * page plays the same path over a shorter distance. */
  const i = Math.max(0, Math.min(SCENE_STATES.length - 1, Math.floor(sceneIndex)));
  const j = Math.min(SCENE_STATES.length - 1, i + 1);
  const t = sceneIndex - i;
  const from = SCENE_STATES[i];
  const to = SCENE_STATES[j];

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

  /* Drag-to-spin state lives in lib/drag-spin as a module singleton: the
     DOM listeners are here and the per-frame integration is in LogoMesh,
     so passing it as a prop would mean one of them mutating an object it
     received. */

  useEffect(() => {
    let lastX = 0;
    let activeId: number | null = null;

    /* Listeners go on WINDOW, not on the canvas element.
     *
     * The canvas sits behind .page-content, which spans the whole page,
     * so a pointer event never actually reaches it — sampling 120 points
     * across the viewport found the canvas on top at none of them. An
     * earlier version listened on the canvas and simply never fired.
     *
     * Listening on window means filtering instead: anything the visitor
     * could be trying to use is left alone, and everything else counts
     * as grabbing the scene. */
    const INTERACTIVE = "a, button, input, select, textarea, label, summary, [role='button']";

    const onDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest?.(INTERACTIVE)) return;
      // Let a real text selection win over spinning the logo.
      if (window.getSelection()?.toString()) return;

      activeId = e.pointerId;
      lastX = e.clientX;
      beginDrag();
      document.documentElement.classList.add("is-spinning");
    };

    const onMove = (e: PointerEvent) => {
      // Passive follow: always tracked, whether dragging or not.
      setPointerX((e.clientX / window.innerWidth) * 2 - 1);

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
      document.documentElement.classList.remove("is-spinning");
    };

    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    // The scene has ambient idle motion, so it is never truly idle and
    // frameloop="demand" would freeze it. Suspending on tab-hide is the
    // honest version of that optimisation.
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      document.removeEventListener("visibilitychange", onVis);
      document.documentElement.classList.remove("is-spinning");
    };
  }, []);

  return (
    <div className="scene-canvas" aria-hidden="true">
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
