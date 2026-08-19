"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* Ambient geometry, deliberately not a logo.
 *
 * This is the hexagonal aperture form from an earlier direction, kept
 * because it moves well. It sits far behind the monogram at low opacity
 * and turns slowly, so it reads as atmosphere rather than as a second
 * mark competing with the brand. Nothing labels it, and it carries no
 * meaning the copy has to support.
 *
 * Built from THREE.Shape rather than a traced SVG: it is pure maths, so
 * an asset file and a loader would be two more things to go wrong.
 */

const R_RING_OUT = 1.0;
const R_RING_IN = 0.82;
const R_BLADE_OUT = 0.72;
const R_BLADE_IN = 0.38;
const BLADE_PAD = 5; // degrees of gap at each end of a blade's wedge
const BLADE_TWIST = 14; // degrees; what makes it read as an aperture

function polar(deg: number, r: number): [number, number] {
  const a = (deg * Math.PI) / 180;
  return [Math.cos(a) * r, Math.sin(a) * r];
}

function hexPoints(r: number): [number, number][] {
  return Array.from({ length: 6 }, (_, k) => polar(90 + 60 * k, r));
}

function shapeFrom(points: [number, number][]): THREE.Shape {
  const s = new THREE.Shape();
  points.forEach(([x, y], i) => (i === 0 ? s.moveTo(x, y) : s.lineTo(x, y)));
  s.closePath();
  return s;
}

function buildShapes(): THREE.Shape[] {
  // Ring: outer hexagon with the inner one punched out as a hole.
  const ring = shapeFrom(hexPoints(R_RING_OUT));
  const hole = new THREE.Path();
  hexPoints(R_RING_IN).forEach(([x, y], i) =>
    i === 0 ? hole.moveTo(x, y) : hole.lineTo(x, y),
  );
  hole.closePath();
  ring.holes.push(hole);

  const blades = Array.from({ length: 6 }, (_, k) => {
    const base = 90 + 60 * k;
    const a0 = base + BLADE_PAD;
    const a1 = base + 60 - BLADE_PAD;
    return shapeFrom([
      polar(a0, R_BLADE_OUT),
      polar(a1, R_BLADE_OUT),
      polar(a1 + BLADE_TWIST, R_BLADE_IN),
      polar(a0 + BLADE_TWIST, R_BLADE_IN),
    ]);
  });

  return [ring, ...blades];
}

export function ApertureMesh({ presence }: { presence: number }) {
  const group = useRef<THREE.Group>(null);

  const geometry = useMemo(() => {
    const shapes = buildShapes();
    return shapes.map(
      (s) =>
        new THREE.ExtrudeGeometry(s, {
          depth: 0.09,
          bevelEnabled: true,
          bevelThickness: 0.02,
          bevelSize: 0.015,
          bevelSegments: 1,
        }),
    );
  }, []);

  useFrame((_, delta) => {
    if (!group.current) return;
    // Slow and constant. Anything faster starts competing for attention
    // with the content in front of it.
    group.current.rotation.z += delta * 0.06;
    group.current.rotation.x = Math.sin(performance.now() / 9000) * 0.12;
  });

  return (
    <group ref={group} position={[-1.4, -0.2, -3.2]} scale={1.9}>
      {geometry.map((g, i) => (
        <mesh key={i} geometry={g}>
          <meshStandardMaterial
            color="#12707a"
            metalness={0.3}
            roughness={0.45}
            transparent
            opacity={(i === 0 ? 0.3 : 0.16) * presence}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
