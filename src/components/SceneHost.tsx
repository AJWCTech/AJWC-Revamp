"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { subscribe, getSnapshot, getServerSnapshot } from "@/lib/capabilities";
import { ScrollProvider } from "./ScrollProvider";
import { StaticScene } from "./StaticScene";
import { SCENE_STATES } from "@/content/site";

/* three and R3F are ~500KB and must not block first paint, so the scene
 * is imported only once we know the device will actually run it. On the
 * fallback paths that bundle is never fetched at all. */
const Scene = dynamic(() => import("./Scene"), { ssr: false });

export function SceneHost({ children }: { children: React.ReactNode }) {
  /* Capability is external state, subscribed to rather than copied into
     React state — so a visitor toggling reduce-motion mid-session gets
     the static path without a reload. The server snapshot is the
     cautious one, so no canvas is ever server-rendered and the static
     mark is what appears in the HTML. */
  const caps = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <ScrollProvider sectionCount={SCENE_STATES.length} enabled={caps.scene3d}>
      {caps.scene3d ? <Scene /> : <StaticScene />}
      {children}
    </ScrollProvider>
  );
}
