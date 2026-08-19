"use client";

import { useMemo, useRef } from "react";
import { useLoader, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { ASSETS } from "@/content/assets";

/* The mark as real geometry.
 *
 * Extruded from the same SVG the favicon and nav use, so there is one
 * mark and no chance of the 3D and 2D versions drifting. Swapping the
 * mark means replacing the SVG — this file does not change.
 *
 * Why the SVG is filled paths and not strokes: ExtrudeGeometry consumes
 * closed shapes. A stroked mark would have to be outlined first.
 */

const BRAND = new THREE.Color("#20C2D2");
const DEEP = new THREE.Color("#12707A");

export function LogoMesh({
  presence,
  spin,
  pointer,
}: {
  presence: number;
  spin: number;
  pointer: { x: number; y: number };
}) {
  const data = useLoader(SVGLoader, ASSETS["logo-mark"].path);
  const group = useRef<THREE.Group>(null);

  /* Rotation is composed from two independent parts so neither can
     cancel the other — see the note in useFrame.
       idle: monotonically increasing, never pulled back
       aimY/aimX: the smoothed scroll and pointer contribution */
  const idle = useRef(0);
  const aimY = useRef(0);
  const aimX = useRef(0);

  const geometry = useMemo(() => {
    const geos: THREE.ExtrudeGeometry[] = [];
    for (const path of data.paths) {
      // three 0.185 deprecates SVGLoader.createShapes() in favour of
      // the ShapePath's own toShapes().
      for (const shape of path.toShapes()) {
        geos.push(
          new THREE.ExtrudeGeometry(shape, {
            depth: 6,
            bevelEnabled: true,
            bevelThickness: 0.8,
            bevelSize: 0.6,
            bevelSegments: 2,
          }),
        );
      }
    }
    const merged = geos;
    // SVG space is 0..64 with Y pointing down; scene space is centred and
    // Y-up, so the group is flipped and recentred rather than every path
    // being re-authored.
    return merged;
  }, [data]);

  /* Layout adapts to the viewport's shape rather than assuming a wide
     desktop window.

     On a phone the copy runs the full width, so there is no empty right
     half to put the mark in; it goes behind the text, centred and
     smaller, and the vignette carries legibility. The old fixed offset
     of x=1.15 pushed it off the side of a portrait frame entirely. */
  const { viewport } = useThree();
  const portrait = viewport.aspect < 1;
  const offsetX = portrait ? 0 : 1.15;
  const offsetY = portrait ? 0.55 : 0.15;
  const sizeFactor = portrait ? 0.012 : 0.018;

  useFrame((_, delta) => {
    if (!group.current) return;

    /* Idle drift and the scroll/pointer target are kept SEPARATE and
       added, rather than the drift being written into rotation.y and
       then lerped toward the target.

       Doing both to the same value made them fight: the lerp pulled the
       rotation back toward the target every frame, cancelling the drift.
       On the homepage that was invisible, because the target moves with
       scroll. On every other page the target is a constant, so the mark
       converged on it within a second and then sat perfectly still —
       which read as "the motion is broken on inner pages". */
    idle.current += delta * 0.12;

    aimY.current = THREE.MathUtils.lerp(aimY.current, spin + pointer.x * 0.35, 0.04);
    aimX.current = THREE.MathUtils.lerp(aimX.current, pointer.y * -0.25, 0.06);

    group.current.rotation.y = idle.current + aimY.current;
    group.current.rotation.x = aimX.current;

    /* Dev-only readout. "The mark is on screen but not moving" is hard to
       eyeball and was a real bug on inner pages, so the rotation is made
       measurable: sample window.__markRotation twice and see if it moved.
       Stripped from production builds. */
    if (process.env.NODE_ENV !== "production") {
      (window as unknown as { __markRotation?: number }).__markRotation =
        group.current.rotation.y;
    }
    const s = THREE.MathUtils.lerp(
      group.current.scale.x,
      sizeFactor * (0.6 + presence * 0.4),
      0.08,
    );
    group.current.scale.setScalar(s);

    /* Ease toward the layout position, plus a small offset that follows
       the pointer in BOTH axes.

       The pointer previously only fed rotation, so moving the cursor up
       and down changed the mark's angle but never its position — which
       reads as "it follows sideways but not vertically". The offsets are
       deliberately small: this is a parallax cue, not the mark chasing
       the mouse around the page. */
    const followX = offsetX + pointer.x * 0.14;
    const followY = offsetY + pointer.y * -0.12;

    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, followX, 0.06);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, followY, 0.06);
  });

  return (
    /* On a wide screen the copy owns the left half and the mark owns the
       right. On a portrait screen it centres behind the text instead —
       see the layout constants above. */
    <group ref={group} scale={sizeFactor} position={[offsetX, offsetY, 0]}>
      {/* Flip Y and recentre the 0..64 SVG box on the origin. */}
      <group scale={[1, -1, 1]} position={[-32, 32, -3]}>
        {geometry.map((g, i) => (
          <mesh key={i} geometry={g} castShadow>
            <meshStandardMaterial
              color={i === 0 ? BRAND : DEEP}
              metalness={0.35}
              roughness={0.28}
              emissive={BRAND}
              emissiveIntensity={i === 0 ? 0.22 : 0.06}
              transparent
              /* Opacity follows presence, with a floor low enough that a
                 receding state actually recedes.
                 The multiplier was 0.96 with a 0.04 floor, which made the
                 mark hard to pick out on the dark theme — a mid presence
                 landed around 30% over a near-black ground. Lifted so it
                 reads as an object rather than a smudge, while a state
                 that asks to recede still gets out of the way. */
              opacity={0.16 + presence * 0.84}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
