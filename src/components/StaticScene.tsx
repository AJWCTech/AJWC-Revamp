import { Mark } from "./Mark";

/* What every fallback path shows instead of the WebGL scene.
 *
 * This replaced a generated placeholder image, which printed its own
 * dimensions across the hero — fine as a build-time stand-in, wrong for
 * anyone actually using the site. Roughly a third of visitors can end up
 * here: reduce-motion is on by default on plenty of Windows machines,
 * every phone gets it, and so does anything without WebGL.
 *
 * It is the real mark, held still, sized and placed to match where the
 * 3D version sits, so the page composition does not change between the
 * two paths — only the movement does. Pure SVG: no GPU, no JS, no
 * request.
 */

export function StaticScene() {
  return (
    <div className="scene-canvas" aria-hidden="true">
      <div className="static-mark">
        <Mark className="h-full w-full text-brand" />
      </div>
    </div>
  );
}
