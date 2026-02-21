// ── Brand wordmarks — plain text, Google Fonts, no SVG ───────────────────────
// rekordbox → Barlow 500   (geometric grotesque, close to Pioneer DJ's typeface)
// serato    → Nunito 800   (rounded geometric bold, close to Serato's Gilroy)
// TRAKTOR   → Bebas Neue  (condensed display caps, close to NI's typeface)

import { Barlow, Nunito, Bebas_Neue } from "next/font/google";

const rekordboxFont = Barlow({ subsets: ["latin"], weight: "500" });
const seratoFont = Nunito({ subsets: ["latin"], weight: "800" });
const traktorFont = Bebas_Neue({ subsets: ["latin"], weight: "400" });

// Screw-head detail — flat-head style
function ScrewHead() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <circle cx="6" cy="6" r="4.5" fill="none" stroke="#2e2e2e" strokeWidth="0.9" />
      <line x1="3.2" y1="6" x2="8.8" y2="6" stroke="#2e2e2e" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  );
}

// ── Integration bar ───────────────────────────────────────────────────────────
export function IntegrationBar() {
  return (
    <div
      style={{
        background: "#111111",
        borderTop: "1px solid #222222",
        borderBottom: "1px solid #222222",
      }}
    >
      <div
        className="relative mx-auto flex items-center"
        style={{ maxWidth: 1280, height: 96, paddingLeft: 32, paddingRight: 32 }}
      >
        {/* Corner screw heads */}
        <span className="absolute top-3.5 left-5">  <ScrewHead /></span>
        <span className="absolute bottom-3.5 left-5"><ScrewHead /></span>
        <span className="absolute top-3.5 right-5">  <ScrewHead /></span>
        <span className="absolute bottom-3.5 right-5"><ScrewHead /></span>

        {/* Panel label */}
        <span
          className="hidden lg:block shrink-0 text-xs font-bold tracking-widest uppercase"
          style={{ color: "#333333", letterSpacing: "0.2em", minWidth: 148 }}
        >
          Pro Integration
        </span>

        {/* Separator rule */}
        <span
          className="hidden lg:block shrink-0 mx-8"
          style={{ width: 1, height: 36, background: "#222222" }}
          aria-hidden="true"
        />

        {/* Three brand wordmarks — evenly spaced, identical size and colour */}
        <div className="flex items-center justify-center flex-1 gap-16 md:gap-20 lg:gap-24">
          <span
            style={{
              ...rekordboxFont.style,
              fontWeight: 500,
              fontSize: 28,
              lineHeight: 1,
              color: "#ffffff",
              letterSpacing: "-0.03em",
            }}
          >
            rekordbox
          </span>

          <span
            style={{
              ...seratoFont.style,
              fontWeight: 800,
              fontSize: 28,
              lineHeight: 1,
              color: "#ffffff",
              letterSpacing: "-0.02em",
            }}
          >
            serato
          </span>

          <span
            style={{
              ...traktorFont.style,
              fontWeight: 400,
              fontSize: 28,
              lineHeight: 1,
              color: "#ffffff",
              letterSpacing: "0.05em",
            }}
          >
            TRAKTOR
          </span>
        </div>
      </div>
    </div>
  );
}
