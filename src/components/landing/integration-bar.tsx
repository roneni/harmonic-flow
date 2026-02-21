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
  height: 32,
  width: "auto",
  display: "block",
  filter: "brightness(0) invert(1)",
};

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

        {/* Three brand logos — evenly spaced, identical height + filter */}
        <div className="flex items-center justify-center flex-1 gap-16 md:gap-20 lg:gap-24">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logos/rekordbox.svg"
            alt="Rekordbox"
            style={LOGO_STYLE}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logos/serato.svg"
            alt="Serato"
            style={LOGO_STYLE}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logos/traktor.svg"
            alt="Traktor"
            style={LOGO_STYLE}
          />
        </div>
      </div>
    </div>
  );
}
