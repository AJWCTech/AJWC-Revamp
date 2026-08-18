"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SCENE_STATES } from "@/content/site";
import { useScrollProgress } from "./ScrollProvider";
import { LogoMesh } from "./LogoMesh";

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
  const { gl } = useThree();
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
      };
    }, 500);
    return () => clearInterval(id);
  }, [gl]);
  return null;
}

function Rig({ pointer }: { pointer: { x: number; y: number } }) {
  const { camera } = useThree();
  const { sceneIndex } = useScrollProgress();
  const camPos = useRef(new THREE.Vector3(0, 0, 4.2));
  const target = useRef(new THREE.Vector3());

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

  return <LogoMesh presence={presence} spin={spin} pointer={pointer} />;
}

export default function Scene() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      setPointer({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // The scene has ambient idle motion, so it is never truly idle and
    // frameloop="demand" would freeze it. Suspending on tab-hide is the
    // honest version of that optimisation.
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
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
          <Rig pointer={pointer} />
        </Suspense>
      </Canvas>
    </div>
  );
}
