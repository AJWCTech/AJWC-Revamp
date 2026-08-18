import { ImageResponse } from "next/og";
import { SITE } from "@/content/site";

/* Generated rather than a checked-in PNG, so the card can never drift
   out of sync with the name, role or brand colour. Next wires this into
   the OG and Twitter tags automatically via the file convention. */

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
          <path
            fill={BRAND}
            fillRule="evenodd"
            d="M32.00 2.00 6.02 17.00 6.02 47.00 32.00 62.00 57.98 47.00 57.98 17.00Z M32.00 8.00 11.22 20.00 11.22 44.00 32.00 56.00 52.78 44.00 52.78 20.00Z"
          />
          <g fill={BRAND} fillOpacity="0.6">
            <path d="M30.17 11.08 14.80 19.95 21.26 27.88 28.26 21.13Z" />
            <path d="M12.97 23.13 12.97 40.87 23.06 39.24 20.71 29.81Z" />
            <path d="M14.80 44.05 30.17 52.92 33.80 43.36 24.46 40.68Z" />
            <path d="M33.83 52.92 49.20 44.05 42.74 36.12 35.74 42.87Z" />
            <path d="M51.03 40.87 51.03 23.13 40.94 24.76 43.29 34.19Z" />
            <path d="M49.20 19.95 33.83 11.08 30.20 20.64 39.54 23.32Z" />
          </g>
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
