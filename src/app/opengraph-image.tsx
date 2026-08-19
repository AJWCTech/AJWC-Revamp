import { ImageResponse } from "next/og";
import { SITE } from "@/content/site";
import { MARK_PATH } from "@/components/Mark";

/* Generated rather than a checked-in PNG, so the card can never drift
   out of sync with the name, role or brand colour. Next wires this into
   the OG and Twitter tags automatically via the file convention. */

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${SITE.name} — ${SITE.role}`;

const BRAND = "#20C2D2";
const BG = "#05070A";
const TEXT = "#F2F5F8";
const MUTED = "#8B97A6";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          padding: 72,
          borderBottom: `10px solid ${BRAND}`,
        }}
      >
        <svg width="96" height="96" viewBox="0 0 64 64">
          <path fill={BRAND} fillRule="evenodd" d={MARK_PATH} />
        </svg>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: TEXT, fontSize: 76, letterSpacing: -2, lineHeight: 1.05 }}>
            {SITE.name}
          </div>
          <div style={{ color: BRAND, fontSize: 34, marginTop: 14 }}>{SITE.role}</div>
          {/* One interpolation, not three: Satori treats each JSX child as
              a node and requires explicit display on any multi-child div. */}
          <div style={{ color: MUTED, fontSize: 26, marginTop: 22 }}>
            {`${SITE.company} · ${SITE.location}`}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
