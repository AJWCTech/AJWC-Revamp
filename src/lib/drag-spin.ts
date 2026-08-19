/* Drag-to-spin state for the 3D mark.
 *
 * A module singleton rather than a ref passed down as a prop. The DOM
 * listeners live in Scene and the per-frame integration lives in
 * LogoMesh, so the state has two owners; threading it through props
 * meant one of them mutating an object it received, which is both a
 * lint error and a genuine smell.
 *
 * There is exactly one scene on the page, so a singleton is honest here
 * rather than a shortcut.
 */

type DragSpin = {
  /** Angular velocity in radians per frame, fed by pointer movement. */
  velocity: number;
  /** True while a pointer is held down and dragging the scene. */
  dragging: boolean;
  /** Total rotation the visitor has applied, in radians. */
  thrown: number;
  /** Pointer x across the viewport, -1 (left) to 1 (right). */
  pointerX: number;
};

const state: DragSpin = { velocity: 0, dragging: false, thrown: 0, pointerX: 0 };

/** Passive horizontal follow. Kept separate from the drag spin so the
 *  two can coexist: the mark leans toward the cursor at rest, and is
 *  spun deliberately when grabbed. */
export function setPointerX(normalised: number): void {
  state.pointerX = normalised;
}

export function getPointerX(): number {
  return state.pointerX;
}

export function beginDrag(): void {
  state.dragging = true;
}

export function endDrag(): void {
  state.dragging = false;
}

/** Called on pointermove with the horizontal delta in pixels. */
export function addDrag(dxPixels: number): void {
  state.velocity += dxPixels * 0.0022;
}

/** Called once per frame by the renderer. Returns the accumulated spin. */
export function stepDragSpin(): number {
  state.thrown += state.velocity;

  if (state.dragging) {
    // While held, the hand is in charge: the input is consumed each
    // frame so the mark tracks the pointer rather than winding up.
    state.velocity = 0;
  } else {
    /* Released: what is left keeps carrying and decays. 0.94 per frame
       settles in roughly a second and a half — long enough to feel like
       weight, short enough not to distract behind the text. */
    state.velocity *= 0.94;
    if (Math.abs(state.velocity) < 0.00005) state.velocity = 0;
  }

  return state.thrown;
}

export function isDragging(): boolean {
  return state.dragging;
}
