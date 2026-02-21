"use client";

import { useState, useEffect, useRef } from "react";

// ── Shared dark brushed metal — imported by integration-bar.tsx ───────────
export const BRUSHED_METAL_BG = [
  "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(255,255,255,0.018) 2px, rgba(255,255,255,0.018) 3px)",
  "linear-gradient(180deg, #363636 0%, #272727 22%, #2e2e2e 50%, #272727 78%, #343434 100%)",
].join(", ");

// ── Outer panel: dark gunmetal ────────────────────────────────────────────
const PANEL_METAL = [
  "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)",
  "linear-gradient(180deg, #525250 0%, #3e3e3c 22%, #464644 50%, #3a3a38 78%, #4e4e4c 100%)",
].join(", ");

// ── Inner frame: bright brushed silver/aluminium ──────────────────────────
const SILVER_FRAME = [
  "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.038) 2px, rgba(0,0,0,0.038) 3px)",
  "linear-gradient(180deg, #d6d4ce 0%, #b8b6b0 22%, #c8c6c0 50%, #aeaca8 78%, #cac8c2 100%)",
].join(", ");

// ── Phillips head screw ────────────────────────────────────────────────────
function PhillipsScrew({ uid, size = 22 }: { uid: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
      <defs>
        <radialGradient id={`pf-${uid}`} cx="36%" cy="30%" r="65%">
          <stop offset="0%"   stopColor="#4a4a48" />
          <stop offset="50%"  stopColor="#2c2c2a" />
          <stop offset="100%" stopColor="#141412" />
        </radialGradient>
      </defs>
      <circle cx="10" cy="10.8" r="9"   fill="rgba(0,0,0,0.55)" />
      <circle cx="10" cy="10"   r="9"   fill="#0e0e0c" stroke="#303030" strokeWidth="0.8" />
      <circle cx="10" cy="10"   r="7.6" fill={`url(#pf-${uid})`} />
      <path d="M4,10 A6,6,0,0,1,16,10" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1.2" />
      <rect x="3"   y="9.2"  width="14"   height="1.6"  rx="0.5" fill="#0a0a08" />
      <rect x="9.2" y="3"    width="1.6"  height="14"   rx="0.5" fill="#0a0a08" />
      <rect x="3"   y="9.2"  width="14"   height="0.55" rx="0.3" fill="#2e2e2c" />
      <rect x="9.2" y="3"    width="0.55" height="14"   rx="0.3" fill="#2e2e2c" />
    </svg>
  );
}

// ── LED segment colours ────────────────────────────────────────────────────
const SEGMENTS = 24;

function segmentColors(index: number, filled: number) {
  if (index >= filled) return { bg: "#0c0c0c", border: "#1c1c1c", shadow: "inset 0 1px 3px rgba(0,0,0,0.95)" };
  const pct = index / SEGMENTS;
  if (pct < 0.6) return { bg: "#84cc16", border: "#567e0a", shadow: "inset 0 1px 0 rgba(255,255,255,0.35), 0 0 7px rgba(132,204,22,0.85)" };
  if (pct < 0.8) return { bg: "#f59e0b", border: "#a06808", shadow: "inset 0 1px 0 rgba(255,255,255,0.30), 0 0 7px rgba(245,158,11,0.85)" };
  return               { bg: "#ef4444", border: "#9e1e1e", shadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 0 7px rgba(239,68,68,0.85)" };
}

function vuBarColor(level: number) {
  if (level > 0.82) return "#ef4444";
  if (level > 0.55) return "#f59e0b";
  return "#84cc16";
}

type PanelState = "idle" | "processing" | "complete";

const VU_PCT  = 65;
const VU_OFF  = (100 - VU_PCT) / 2;
const BOLT_R  = 44;
const BOLT_SZ = 3.6;
const BOLTS   = [45, 135, 225, 315].map((deg) => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return {
    left: `${(50 + BOLT_R * Math.cos(rad) - BOLT_SZ / 2).toFixed(2)}%`,
    top:  `${(50 + BOLT_R * Math.sin(rad) - BOLT_SZ / 2).toFixed(2)}%`,
  };
});

const GROOVES = [70, 74, 78, 82, 86, 90, 94];

export function StudioInputUpload() {
  const [panelState, setPanelState] = useState<PanelState>("idle");
  const [progress,   setProgress]   = useState(0);
  const [vuBars,     setVuBars]     = useState<number[]>(Array(10).fill(0.08));
  const [ledOn,      setLedOn]      = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const flashRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (panelState !== "processing") return;
    setProgress(0);
    timerRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(timerRef.current!); setPanelState("complete"); return 100; }
        return p + 1;
      });
      setVuBars(Array(10).fill(0).map(() => 0.1 + Math.random() * 0.9));
    }, 60);
    return () => clearInterval(timerRef.current!);
  }, [panelState]);

  useEffect(() => {
    if (panelState !== "complete") { setLedOn(true); return; }
    let n = 0;
    flashRef.current = setInterval(() => {
      setLedOn((v) => !v);
      if (++n >= 8) { clearInterval(flashRef.current!); setLedOn(true); }
    }, 260);
    return () => clearInterval(flashRef.current!);
  }, [panelState]);

  const handleActivate = () => {
    if (panelState === "idle") setPanelState("processing");
    else if (panelState === "complete") { setPanelState("idle"); setProgress(0); setVuBars(Array(10).fill(0.08)); }
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (panelState === "idle") setPanelState("processing");
  };

  const filledSegs   = Math.round((progress / 100) * SEGMENTS);
  const signalActive = !(panelState === "complete" && !ledOn);

  const vuGlow =
    panelState === "idle"
      ? [
          "0 0 0 3px rgba(132,204,22,0.55)",
          "0 0 14px 5px rgba(132,204,22,0.75)",
          "0 0 36px 12px rgba(132,204,22,0.40)",
          "0 0 70px 24px rgba(132,204,22,0.18)",
        ].join(", ")
      : panelState === "processing"
        ? [
            "0 0 0 4px rgba(132,204,22,0.85)",
            "0 0 20px 8px rgba(132,204,22,0.95)",
            "0 0 50px 18px rgba(132,204,22,0.60)",
            "0 0 100px 36px rgba(132,204,22,0.28)",
          ].join(", ")
        : ledOn
          ? [
              "0 0 0 4px #84cc16",
              "0 0 24px 10px rgba(132,204,22,1)",
              "0 0 60px 22px rgba(132,204,22,0.70)",
              "0 0 120px 44px rgba(132,204,22,0.35)",
            ].join(", ")
          : "0 0 0 2px rgba(132,204,22,0.15), 0 0 8px 2px rgba(132,204,22,0.10)";

  return (
    <section
      aria-label="Studio Input Upload"
      style={{
        background:   PANEL_METAL,
        borderTop:    "2px solid #606060",
        borderBottom: "2px solid #1a1a18",
        boxShadow: [
          "0 -1px 0 rgba(255,255,255,0.06)",
          "0  4px 16px rgba(0,0,0,0.75)",
          "inset 0  2px 0 rgba(255,255,255,0.055)",
          "inset 0 -2px 0 rgba(0,0,0,0.50)",
        ].join(", "),
      }}
    >
      {/* ── Top rack rail ── */}
      <div style={{
        height:       7,
        background:   "linear-gradient(180deg, #141414, #222220)",
        borderBottom: "1px solid #2e2e2c",
        boxShadow:    "0 2px 4px rgba(0,0,0,0.5)",
      }} />

      {/* ── Outer panel content ── */}
      <div
        className="mx-auto"
        style={{
          maxWidth:      1280,
          display:       "flex",
          alignItems:    "center",
          gap:           "clamp(20px, 3vw, 48px)",
          paddingLeft:   "clamp(32px, 4vw, 64px)",
          paddingRight:  "clamp(32px, 4vw, 64px)",
          paddingTop:    "clamp(20px, 2.5vw, 36px)",
          paddingBottom: "clamp(20px, 2.5vw, 36px)",
        }}
      >

        {/* ══ SILVER INSET FRAME — the brushed aluminium plate ═════════════ */}
        <div style={{
          position:     "relative",
          flex:         "1 1 auto",
          background:   SILVER_FRAME,
          borderRadius: 6,
          borderTop:    "2px solid #e0deda",
          borderLeft:   "2px solid #d8d6d0",
          borderRight:  "2px solid #989490",
          borderBottom: "2px solid #888480",
          boxShadow: [
            "inset 0  1px 0 rgba(255,255,255,0.55)",
            "inset 0 -1px 0 rgba(0,0,0,0.18)",
            "3px 3px 12px rgba(0,0,0,0.55)",
            "0 1px 0 rgba(255,255,255,0.06)",
          ].join(", "),
          padding: "clamp(20px, 2.5vw, 36px)",
        }}>

          {/* Phillips screws at frame corners */}
          <span style={{ position: "absolute", top:  10, left:  10 }}><PhillipsScrew uid="tl" size={20} /></span>
          <span style={{ position: "absolute", top:  10, right: 10 }}><PhillipsScrew uid="tr" size={20} /></span>
          <span style={{ position: "absolute", bottom: 10, left:  10 }}><PhillipsScrew uid="bl" size={20} /></span>
          <span style={{ position: "absolute", bottom: 10, right: 10 }}><PhillipsScrew uid="br" size={20} /></span>

          {/* Column: header + ring, both centred on the same axis */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

            {/* Header — engraved on silver */}
            <p style={{
              margin:        0,
              marginBottom:  "clamp(10px, 1.2vw, 18px)",
              color:         "#1e1c18",
              fontSize:      "clamp(11px, 1.1vw, 15px)",
              fontWeight:    700,
              letterSpacing: "0.45em",
              textTransform: "uppercase",
              fontFamily:    "var(--font-mono)",
              textShadow:    "0 1px 0 rgba(255,255,255,0.55), 0 -1px 0 rgba(0,0,0,0.15)",
            }}>
              Studio Input Upload
            </p>

            {/* ── Machined ring ── */}
            <div style={{
              position:     "relative",
              width:        "clamp(340px, 46vw, 580px)",
              aspectRatio:  "1",
              borderRadius: "50%",
              background: [
                "radial-gradient(circle at 38% 33%, rgba(90,90,88,0.50) 0%, rgba(0,0,0,0) 48%)",
                "repeating-conic-gradient(from 0deg, #141412 0deg, #2a2a28 4deg, #141412 8deg)",
              ].join(", "),
              boxShadow: [
                "0 12px 48px rgba(0,0,0,0.90)",
                "0  3px 12px rgba(0,0,0,0.70)",
                "inset 0  1px 0 rgba(255,255,255,0.06)",
                "inset 0 -1px 0 rgba(0,0,0,0.85)",
              ].join(", "),
            }}>

              {/* Lathe groove rings */}
              {GROOVES.map((pct) => (
                <div key={pct} style={{
                  position:      "absolute",
                  width:         `${pct}%`,
                  height:        `${pct}%`,
                  borderRadius:  "50%",
                  border:        `${pct >= 90 ? 1 : 0.6}px solid ${pct >= 88 ? "#222220" : "#1c1c1a"}`,
                  left:          `${(100 - pct) / 2}%`,
                  top:           `${(100 - pct) / 2}%`,
                  pointerEvents: "none",
                }} />
              ))}

              {/* Bolt holes */}
              {BOLTS.map((b, i) => (
                <div key={i} style={{
                  position:     "absolute",
                  width:        `${BOLT_SZ}%`,
                  height:       `${BOLT_SZ}%`,
                  borderRadius: "50%",
                  left:         b.left,
                  top:          b.top,
                  background:   "radial-gradient(circle at 35% 30%, #2a2a28, #080806)",
                  border:       "1px solid #1e1e1c",
                  boxShadow:    "inset 0 1px 4px rgba(0,0,0,0.95)",
                }} />
              ))}

              {/* ── VU circle — green halo ── */}
              <div
                role="button"
                tabIndex={0}
                onClick={handleActivate}
                onKeyDown={(e) => e.key === "Enter" && handleActivate()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                aria-label={
                  panelState === "idle"       ? "Click or drop XML to begin" :
                  panelState === "processing" ? `Analyzing: ${progress}%` :
                                                "Complete — click to reset"
                }
                style={{
                  position:       "absolute",
                  width:          `${VU_PCT}%`,
                  height:         `${VU_PCT}%`,
                  left:           `${VU_OFF}%`,
                  top:            `${VU_OFF}%`,
                  borderRadius:   "50%",
                  background:     "radial-gradient(circle at 44% 38%, #1a1a18 0%, #0c0c0a 45%, #040402 100%)",
                  border:         "2.5px solid #84cc16",
                  boxShadow:      vuGlow,
                  display:        "flex",
                  flexDirection:  "column",
                  alignItems:     "center",
                  justifyContent: "center",
                  cursor:         panelState === "processing" ? "default" : "pointer",
                  transition:     "box-shadow 0.45s ease",
                  outline:        "none",
                  overflow:       "hidden",
                }}
              >
                <svg
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
                  viewBox="0 0 200 200"
                  aria-hidden="true"
                >
                  {Array.from({ length: 36 }, (_, i) => {
                    const angle   = (i / 36) * 2 * Math.PI - Math.PI / 2;
                    const isMajor = i % 9 === 0;
                    const r1 = 98, r2 = isMajor ? 88 : 93;
                    return (
                      <line key={i}
                        x1={100 + r1 * Math.cos(angle)} y1={100 + r1 * Math.sin(angle)}
                        x2={100 + r2 * Math.cos(angle)} y2={100 + r2 * Math.sin(angle)}
                        stroke={isMajor ? "#2e2e2c" : "#1e1e1c"}
                        strokeWidth={isMajor ? 1.6 : 1}
                      />
                    );
                  })}
                </svg>

                {panelState === "processing" && (
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 36, marginBottom: 6, flexShrink: 0 }}>
                    {vuBars.map((v, i) => (
                      <div key={i} style={{
                        width:        7,
                        height:       Math.max(3, Math.round(v * 36)),
                        background:   vuBarColor(v),
                        borderRadius: 1,
                        boxShadow:    `0 0 5px ${vuBarColor(v)}`,
                        flexShrink:   0,
                      }} />
                    ))}
                  </div>
                )}

                {panelState === "idle" && (
                  <div style={{ width: "38%", height: 1, background: "#262624", marginBottom: 12, flexShrink: 0 }} />
                )}

                <div style={{ textAlign: "center", padding: "0 14%", zIndex: 1 }}>
                  {panelState === "idle" && (
                    <>
                      <div style={{ color: "#ffffff", fontSize: "clamp(8px, 0.65vw, 10px)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: 5 }}>
                        Patch In Your Playlist
                      </div>
                      <div style={{ color: "#8a8a88", fontSize: "clamp(7px, 0.55vw, 9px)", letterSpacing: "0.07em", textTransform: "uppercase", fontFamily: "var(--font-mono)", lineHeight: 1.75 }}>
                        Drop XML<br />(Rekordbox, Serato, Traktor)
                      </div>
                    </>
                  )}
                  {panelState === "processing" && (
                    <>
                      <div style={{ color: "#84cc16", fontSize: "clamp(7px, 0.6vw, 9px)", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: 4 }}>
                        Analyzing Harmonics...
                      </div>
                      <div style={{ color: "#ffffff", fontSize: "clamp(20px, 2.5vw, 32px)", fontWeight: 700, fontFamily: "var(--font-mono)", lineHeight: 1, textShadow: "0 0 14px rgba(255,255,255,0.45)" }}>
                        {progress}%
                      </div>
                    </>
                  )}
                  {panelState === "complete" && (
                    <div style={{ color: "#84cc16", fontSize: "clamp(8px, 0.7vw, 10px)", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", fontFamily: "var(--font-mono)", lineHeight: 1.85, textShadow: "0 0 10px rgba(132,204,22,0.65)" }}>
                      Optimization<br />Complete
                    </div>
                  )}
                </div>

                {panelState !== "idle" && (
                  <div style={{ display: "flex", gap: "clamp(1px, 0.15vw, 2px)", marginTop: 14, flexShrink: 0 }}>
                    {Array.from({ length: SEGMENTS }, (_, i) => {
                      const c = segmentColors(i, filledSegs);
                      return (
                        <div key={i} style={{
                          width:        "clamp(4px, 0.55vw, 7px)",
                          height:       "clamp(10px, 1.1vw, 14px)",
                          borderRadius: 2,
                          background:   c.bg,
                          border:       `1px solid ${c.border}`,
                          boxShadow:    c.shadow,
                          transition:   "background 0.06s, box-shadow 0.06s",
                          flexShrink:   0,
                        }} />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            {/* end ring */}
          </div>
          {/* end column */}
        </div>
        {/* ══ end silver frame ══ */}

        {/* ── Right column: SIGNAL INPUT + PROCESSING, on the dark panel ── */}
        <div style={{
          display:       "flex",
          flexDirection: "column",
          gap:           "clamp(16px, 2vw, 28px)",
          flexShrink:    0,
        }}>

          {/* SIGNAL INPUT */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width:        12,
              height:       12,
              borderRadius: "50%",
              border:       "1px solid #3a3a38",
              background:   signalActive ? "#84cc16" : "#1e1e1c",
              boxShadow:    signalActive && panelState !== "idle"
                              ? "0 0 10px rgba(132,204,22,0.95), 0 0 20px rgba(132,204,22,0.45)"
                              : "none",
              animation:    panelState === "idle" ? "led-pulse 2.4s ease-in-out infinite" : "none",
              transition:   "background 0.15s, box-shadow 0.15s",
              flexShrink:   0,
            }} />
            <span style={{
              color:         "#909088",
              fontSize:      10,
              fontWeight:    700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontFamily:    "var(--font-mono)",
              whiteSpace:    "nowrap",
            }}>
              Signal Input
            </span>
          </div>

          {/* PROCESSING */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width:        12,
              height:       12,
              borderRadius: "50%",
              border:       "1px solid #3a3a38",
              background:   panelState === "processing" ? "#84cc16" : "#1e1e1c",
              boxShadow:    panelState === "processing"
                              ? "0 0 10px rgba(132,204,22,0.95), 0 0 20px rgba(132,204,22,0.45)"
                              : "none",
              transition:   "background 0.2s, box-shadow 0.2s",
              flexShrink:   0,
            }} />
            <span style={{
              color:         "#909088",
              fontSize:      10,
              fontWeight:    700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontFamily:    "var(--font-mono)",
              whiteSpace:    "nowrap",
            }}>
              Processing
            </span>
          </div>

        </div>
        {/* end right column */}

      </div>
      {/* end outer panel content */}

      {/* ── Bottom rack rail ── */}
      <div style={{
        height:    7,
        background: "linear-gradient(0deg, #141414, #222220)",
        borderTop:  "1px solid #2e2e2c",
        boxShadow:  "0 -2px 4px rgba(0,0,0,0.4)",
      }} />
    </section>
  );
}
