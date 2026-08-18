"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useSyncExternalStore } from "react";
import { subscribe, getSnapshot, getServerSnapshot } from "@/lib/capabilities";
import { ScrollProvider } from "./ScrollProvider";
import { SCENE_STATES } from "@/content/site";
import { ASSETS } from "@/content/assets";

/* three and R3F are ~500KB and must not block first paint, so the scene
 * is imported only once we know the device will actually run it. On the
 * fallback paths that bundle is never fetched at all. */
const Scene = dynamic(() => import("./Scene"), { ssr: false });

export function SceneHost({ children }: { children: React.ReactNode }) {
  /* Capability is external state, subscribed to rather than copied into
     React state — so a visitor toggling reduce-motion mid-session gets
     the static path without a reload. The server snapshot is the
     cautious one, so no canvas is ever server-rendered. */
  const caps = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const poster = ASSETS["hero-poster"];

  return (
    <ScrollProvider sectionCount={SCENE_STATES.length} enabled={caps.scene3d}>
      {caps.scene3d ? (
        <Scene />
      ) : (
        <div className="scene-canvas" aria-hidden="true">
          <Image
            src={poster.path}
            alt=""
            width={poster.width}
            height={poster.height}
            className="h-full w-full object-cover opacity-30"
          />
        </div>
      )}
      {children}
    </ScrollProvider>
  );
}
