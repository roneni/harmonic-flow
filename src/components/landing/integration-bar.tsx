// ── Integration bar — self-hosted SVG logos via <img> + CSS filter ────────────
// /public/logos/rekordbox.svg — path data from official Pioneer DJ CDN
// /public/logos/traktor.svg   — path data from official NI CDN
// /public/logos/serato.svg    — SVG text (official Serato SVG is auth-gated)
//
// filter: brightness(0) invert(1) forces every logo to pure #ffffff regardless
// of its original fill colour. Static local files — nothing to break at runtime.

import { BRUSHED_METAL_BG } from "./studio-input-upload";

// ── Screw head — matches studio-input-upload.tsx ──────────────────────────
function ScrewHead() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <circle cx="7" cy="7" r="6"   fill="#181818" stroke="#3c3c3c" strokeWidth="0.9" />
      <circle cx="7" cy="7" r="3.8" fill="none"    stroke="#2a2a2a" strokeWidth="0.6" />
      <line x1="3.4" y1="7" x2="10.6" y2="7" stroke="#505050" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

const LOGO_STYLE: React.CSSProperties = {
  height: 32,
  width: "auto",
  display: "block",
  filter: "brightness(0) invert(1)",
};

// ── Integration bar ────────────────────────────────────────────────────────
export function IntegrationBar() {
  return (
    <div
      style={{
        background:   BRUSHED_METAL_BG,
        borderTop:    "2px solid #3c3c3c",
        borderBottom: "2px solid #0e0e0e",
        boxShadow:    "inset 0 2px 0 rgba(255,255,255,0.055), inset 0 -2px 0 rgba(0,0,0,0.55)",
      }}
    >
      {/* Top rack rail */}
      <div style={{ height: 7, background: "linear-gradient(180deg,#141414,#1e1e1e)", borderBottom: "1px solid #2a2a2a" }} />

      <div
        className="relative mx-auto flex items-center"
        style={{ maxWidth: 1280, height: 116, paddingLeft: 32, paddingRight: 32 }}
      >
        {/* Corner screw heads */}
        <span className="absolute top-3 left-5">  <ScrewHead /></span>
        <span className="absolute bottom-3 left-5"><ScrewHead /></span>
        <span className="absolute top-3 right-5">  <ScrewHead /></span>
        <span className="absolute bottom-3 right-5"><ScrewHead /></span>

        {/* Panel label — same monospace style as Studio Input Upload header */}
        <span
          className="hidden lg:block shrink-0"
          style={{
            color:         "#ffffff",
            fontSize:      13,
            fontWeight:    700,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            fontFamily:    "var(--font-mono)",
            textShadow:    "0 0 12px rgba(255,255,255,0.18)",
            minWidth:      156,
          }}
        >
          Compatible With
        </span>

        {/* Separator rule */}
        <span
          className="hidden lg:block shrink-0 mx-8"
          style={{ width: 1, height: 40, background: "#2a2a2a", boxShadow: "1px 0 0 #111" }}
          aria-hidden="true"
        />

        {/* Three brand logos — evenly spaced, identical height + filter */}
        <div className="flex items-center justify-center flex-1 gap-16 md:gap-20 lg:gap-24">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logos/rekordbox.svg" alt="Rekordbox" style={LOGO_STYLE} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logos/serato.svg"    alt="Serato"    style={LOGO_STYLE} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logos/traktor.svg"   alt="Traktor"   style={LOGO_STYLE} />
        </div>
      </div>

      {/* Bottom rack rail */}
      <div style={{ height: 7, background: "linear-gradient(0deg,#141414,#1e1e1e)", borderTop: "1px solid #2a2a2a" }} />
    </div>
  );
}
