// ── Integration bar — self-hosted SVG logos via <img> + CSS filter ────────────
// /public/logos/rekordbox.svg — path data from official Pioneer DJ CDN
// /public/logos/traktor.svg   — path data from official NI CDN
// /public/logos/serato.svg    — SVG text (official Serato SVG is auth-gated)
//
// filter: brightness(0) invert(1) forces every logo to pure #ffffff regardless
// of its original fill colour. Static local files — nothing to break at runtime.

// Screw-head detail — flat-head style
function ScrewHead() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <circle cx="6" cy="6" r="4.5" fill="none" stroke="#2e2e2e" strokeWidth="0.9" />
      <line x1="3.2" y1="6" x2="8.8" y2="6" stroke="#2e2e2e" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  );
}

const LOGO_STYLE: React.CSSProperties = {
  height: 28, // refined smaller optical height 
  width: "auto",
  display: "block",
  filter: "brightness(0) invert(1)",
  opacity: 0.85,
  transition: "opacity 200ms ease",
};

// ── Integration bar ───────────────────────────────────────────────────────────
export function IntegrationBar() {
  return (
    <div
      style={{
        background: "#0a0a0a", // Match hero section background for seamless flow
        borderBottom: "1px solid #1a1a1a",
      }}
      className="py-12 md:py-16"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-8 px-6">
        {/* Panel label */}
        <p className="text-xs font-semibold tracking-[0.25em] text-[#666666] uppercase">
          Compatible With
        </p>

        {/* Three brand logos — exactly equal spacing, identical height */}
        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20 lg:gap-24">
          <img
            src="/logos/rekordbox.svg"
            alt="Rekordbox"
            style={LOGO_STYLE}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.85")}
          />
          <img
            src="/logos/serato.svg"
            alt="Serato"
            style={LOGO_STYLE}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.85")}
          />
          <img
            src="/logos/traktor.svg"
            alt="Traktor"
            style={LOGO_STYLE}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.85")}
          />
        </div>
      </div>
    </div>
  );
}
