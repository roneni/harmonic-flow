// Screw-head SVG — flat-head style, used at panel corners
function ScrewHead() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <circle cx="6" cy="6" r="4.5" fill="none" stroke="#333333" strokeWidth="0.9" />
      <line x1="3.2" y1="6" x2="8.8" y2="6" stroke="#333333" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  );
}

// ── Simplified monochrome brand icons ─────────────────────────────────────────
// Stylised geometric representations (not official brand assets).
// Swap src paths for official brand SVGs when available.

function RekordboxIcon() {
  // Diamond shape — references Pioneer's Rekordbox diamond motif
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <polygon
        points="11,2 20,11 11,20 2,11"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <polygon
        points="11,6 16,11 11,16 6,11"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
        opacity="0.5"
      />
    </svg>
  );
}

function SeratoIcon() {
  // Two parallel waveform arcs — references Serato's wave identity
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path
        d="M3 8 Q7 3 11 8 Q15 13 19 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 14 Q7 9 11 14 Q15 19 19 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TraktorIcon() {
  // Crosshair target — references Native Instruments Traktor mark
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="11" cy="11" r="2.5" fill="currentColor" />
      <line x1="11" y1="1"  x2="11" y2="5.5"  stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="11" y1="16.5" x2="11" y2="21" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="1"  y1="11" x2="5.5"  y2="11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="16.5" y1="11" x2="21" y2="11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

const BRANDS = [
  { name: "Rekordbox", Icon: RekordboxIcon },
  { name: "Serato",    Icon: SeratoIcon    },
  { name: "Traktor",   Icon: TraktorIcon   },
] as const;

// ── Component ─────────────────────────────────────────────────────────────────
export function IntegrationBar() {
  return (
    <div
      style={{
        background: "#141414",
        borderTop:    "1px solid #272727",
        borderBottom: "1px solid #272727",
      }}
    >
      {/* Rack-mount panel */}
      <div
        className="relative mx-auto flex items-center"
        style={{
          maxWidth: 1280,
          height: 72,
          paddingLeft: 28,
          paddingRight: 28,
        }}
      >
        {/* ── Corner screw heads ─────────────────────────────────────────── */}
        <span className="absolute top-3 left-4">    <ScrewHead /></span>
        <span className="absolute bottom-3 left-4">  <ScrewHead /></span>
        <span className="absolute top-3 right-4">   <ScrewHead /></span>
        <span className="absolute bottom-3 right-4"><ScrewHead /></span>

        {/* ── Panel label ────────────────────────────────────────────────── */}
        <span
          className="hidden sm:block shrink-0 text-xs font-bold tracking-widest uppercase"
          style={{ color: "#444444", letterSpacing: "0.18em", minWidth: 140 }}
        >
          Pro Integration
        </span>

        {/* ── Separator rule ─────────────────────────────────────────────── */}
        <span
          className="hidden sm:block shrink-0 mx-6"
          style={{ width: 1, height: 32, background: "#272727" }}
          aria-hidden="true"
        />

        {/* ── Brand logos ────────────────────────────────────────────────── */}
        <div className="flex items-center justify-center sm:justify-start gap-10 flex-1">
          {BRANDS.map(({ name, Icon }) => (
            <div
              key={name}
              className="flex items-center gap-2.5"
              style={{ color: "#666666" }}
            >
              <Icon />
              <span
                className="text-xs font-semibold tracking-widest uppercase"
                style={{ letterSpacing: "0.14em" }}
              >
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
