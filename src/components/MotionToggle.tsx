"use client";

import { useSyncExternalStore } from "react";
import {
  getMotionPreference,
  setMotionPreference,
  subscribeMotion,
} from "@/lib/motion-preference";
import { getSnapshot, subscribe } from "@/lib/capabilities";

/* Lets a visitor turn the 3D on even when their OS says reduce motion.
 *
 * Respecting prefers-reduced-motion is right as a default and wrong as a
 * prison — plenty of people switch Windows animations off for the
 * taskbar, not because motion on a website hurts them. The default is
 * still the OS setting; this only adds a way to disagree with it.
 *
 * Hidden entirely when there is no WebGL, since offering a switch that
 * cannot do anything is worse than offering none.
 */

export function MotionToggle() {
  const preference = useSyncExternalStore(
    subscribeMotion,
    getMotionPreference,
    () => "system" as const,
  );
  const caps = useSyncExternalStore(subscribe, getSnapshot, () => null);

  if (!caps || !caps.webgl) return null;

  const running = caps.scene3d;

  return (
    <button
      type="button"
      onClick={() => setMotionPreference(running ? "off" : "on")}
      aria-pressed={running}
      className="link-sweep text-left text-sm text-muted"
    >
      {running ? "Motion: on" : "Motion: off"}
      {preference === "system" ? (
        <span className="sr-only"> (following your system setting)</span>
      ) : null}
    </button>
  );
}
