"use client";

import { useMemo, useRef } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
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

  useFrame((_, delta) => {
    if (!group.current) return;
    // Ambient idle drift plus the scroll-driven spin, plus a gentle lean
    // toward the pointer. Multiplying by delta keeps it framerate-independent.
    group.current.rotation.y += delta * 0.12;
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      spin + pointer.x * 0.35,
      0.04,
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      pointer.y * -0.25,
      0.06,
    );
    const s = THREE.MathUtils.lerp(group.current.scale.x, 0.018 * (0.6 + presence * 0.4), 0.08);
    group.current.scale.setScalar(s);
  });

  return (
    /* Offset right of centre. Centred, the mark sat directly behind the
       headline and made it hard to read; the copy owns the left half of
       the viewport and the mark owns the right. */
    <group ref={group} scale={0.018} position={[1.15, 0.15, 0]}>
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
              /* Opacity follows presence almost linearly. An earlier
                 version floored this at 0.35, which meant a state asking
                 for 0.16 still rendered at 45% and the mark sat over the
                 work cards competing with them. The floor is now low
                 enough that "recede" actually recedes. */
              opacity={0.04 + presence * 0.96}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
