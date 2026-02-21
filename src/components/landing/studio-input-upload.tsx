"use client";

import { useState, useEffect, useRef } from "react";

// ── Shared brushed-metal surface (imported by integration-bar.tsx) ─────────
export const BRUSHED_METAL_BG = [
  "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(255,255,255,0.018) 2px, rgba(255,255,255,0.018) 3px)",
  "linear-gradient(180deg, #363636 0%, #272727 22%, #2e2e2e 50%, #272727 78%, #343434 100%)",
].join(", ");

// ── Phillips head screw — SVG cross + recessed look ────────────────────────
function PhillipsScrew({ uid }: { uid: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <defs>
        <radialGradient id={`pf-${uid}`} cx="36%" cy="30%" r="65%">
          <stop offset="0%"   stopColor="#454545" />
          <stop offset="50%"  stopColor="#282828" />
          <stop offset="100%" stopColor="#141414" />
        </radialGradient>
      </defs>
      {/* Drop shadow — makes screw look physically recessed */}
      <circle cx="10" cy="10.8" r="9"   fill="rgba(0,0,0,0.65)" />
      {/* Outer collar (counterbore hole in panel) */}
      <circle cx="10" cy="10"   r="9"   fill="#0e0e0e" stroke="#2e2e2e" strokeWidth="0.6" />
      {/* Screw face with radial sheen */}
      <circle cx="10" cy="10"   r="7.6" fill={`url(#pf-${uid})`} />
      {/* Rim highlight — top arc catching light */}
      <path d="M4,10 A6,6,0,0,1,16,10" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.2" />
      {/* Phillips cross — horizontal slot */}
      <rect x="3"    y="9.2"  width="14"  height="1.6" rx="0.5" fill="#0b0b0b" />
      {/* Phillips cross — vertical slot */}
      <rect x="9.2"  y="3"    width="1.6" height="14"  rx="0.5" fill="#0b0b0b" />
      {/* Slot highlights (light catching top/left face of each slot) */}
      <rect x="3"    y="9.2"  width="14"  height="0.55" rx="0.3" fill="#2c2c2c" />
      <rect x="9.2"  y="3"    width="0.55" height="14" rx="0.3" fill="#2c2c2c" />
    </svg>
  );
}

// ── LED segment colours ────────────────────────────────────────────────────
const SEGMENTS = 24;

function segmentColors(index: number, filled: number) {
  if (index >= filled) return { bg: "#0c0c0c", border: "#1c1c1c", shadow: "inset 0 1px 3px rgba(0,0,0,0.95)" };
  const pct = index / SEGMENTS;
  if (pct < 0.6) return { bg: "#84cc16", border: "#567e0a", shadow: "inset 0 1px 0 rgba(255,255,255,0.35), 0 0 7px rgba(132,204,22,0.85)"  };
  if (pct < 0.8) return { bg: "#f59e0b", border: "#a06808", shadow: "inset 0 1px 0 rgba(255,255,255,0.30), 0 0 7px rgba(245,158,11,0.85)"  };
  return               { bg: "#ef4444", border: "#9e1e1e", shadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 0 7px rgba(239,68,68,0.85)"   };
}

function vuBarColor(level: number) {
  if (level > 0.82) return "#ef4444";
  if (level > 0.55) return "#f59e0b";
  return "#84cc16";
}

// ── Types ──────────────────────────────────────────────────────────────────
type PanelState = "idle" | "processing" | "complete";

// ── Ring geometry constants ────────────────────────────────────────────────
// VU circle = 65% of ring → ring band = 17.5% each side of the ring diameter
const VU_PCT   = 65;    // % of ring
const VU_OFF   = (100 - VU_PCT) / 2;  // 17.5% — offset for absolute positioning

// Bolt holes at diagonal corners: 44% radius, 45°/135°/225°/315°
const BOLT_R   = 44;    // % from centre
const BOLT_SZ  = 3.6;   // % of ring (bolt hole diameter)
const BOLTS    = [45, 135, 225, 315].map((deg) => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return {
    left: `${(50 + BOLT_R * Math.cos(rad) - BOLT_SZ / 2).toFixed(2)}%`,
    top:  `${(50 + BOLT_R * Math.sin(rad) - BOLT_SZ / 2).toFixed(2)}%`,
  };
});

// Lathe groove rings — percentages of ring diameter, spaced through the band
const GROOVES = [70, 74, 78, 82, 86, 90, 94];

// ── Component ──────────────────────────────────────────────────────────────
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

  const ringGlow =
    panelState === "idle"
      ? "0 0 12px rgba(132,204,22,0.20), 0 0 28px rgba(132,204,22,0.07)"
      : panelState === "processing"
        ? "0 0 22px rgba(132,204,22,0.65), 0 0 44px rgba(132,204,22,0.28)"
        : ledOn
          ? "0 0 30px rgba(132,204,22,0.92), 0 0 60px rgba(132,204,22,0.40)"
          : "0 0 8px rgba(132,204,22,0.18)";

  return (
    <section
      aria-label="Studio Input Upload"
      style={{
        background:   BRUSHED_METAL_BG,
        borderTop:    "2px solid #484848",
        borderBottom: "2px solid #0a0a0a",
        boxShadow:    [
          "0 -1px 0 rgba(255,255,255,0.04)",
          "0  2px 8px rgba(0,0,0,0.8)",
          "inset 0  2px 0 rgba(255,255,255,0.065)",
          "inset 0 -2px 0 rgba(0,0,0,0.60)",
        ].join(", "),
      }}
    >
      {/* ── Top rack rail ─────────────────────────────────────────────── */}
      <div style={{
        height:           7,
        background:       "linear-gradient(180deg, #111, #1d1d1d)",
        borderBottom:     "1px solid #2c2c2c",
        boxShadow:        "inset 0 -1px 0 rgba(255,255,255,0.02)",
      }} />

      {/*
        Padding maths — ring / panel-height ≈ 65%
        At 1280px: ring=500, vPad=64 each, header=52, procRow=44, rails=14
        → total = 14+64+52+24+500+20+44+64+14 = 796  → 500/796 = 62.8% ✓
      */}
      <div
        className="relative mx-auto"
        style={{
          maxWidth:      1280,
          paddingLeft:   "clamp(28px, 3.5vw, 48px)",
          paddingRight:  "clamp(28px, 3.5vw, 48px)",
          paddingTop:    "clamp(48px, 5.5vw, 72px)",
          paddingBottom: "clamp(48px, 5.5vw, 72px)",
        }}
      >
        {/* ── Phillips head screws at each corner ───────────────────── */}
        <span style={{ position: "absolute", top: 14,  left:  22 }}><PhillipsScrew uid="tl" /></span>
        <span style={{ position: "absolute", top: 14,  right: 22 }}><PhillipsScrew uid="tr" /></span>
        <span style={{ position: "absolute", bottom: 14, left:  22 }}><PhillipsScrew uid="bl" /></span>
        <span style={{ position: "absolute", bottom: 14, right: 22 }}><PhillipsScrew uid="br" /></span>

        {/* ── Panel header ──────────────────────────────────────────── */}
        <p style={{
          textAlign:     "center",
          margin:        0,
          marginBottom:  "clamp(16px, 2vw, 24px)",
          color:         "#ffffff",
          fontSize:      "clamp(13px, 1.35vw, 18px)",
          fontWeight:    700,
          letterSpacing: "0.40em",
          textTransform: "uppercase",
          fontFamily:    "var(--font-mono)",
          textShadow:    "0 1px 2px rgba(0,0,0,0.8), 0 0 16px rgba(255,255,255,0.15)",
        }}>
          Studio Input Upload
        </p>

        {/* ── Main content row: ring + signal indicator ─────────────── */}
        <div style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          gap:            "clamp(28px, 4.5vw, 60px)",
        }}>

          {/* ── Machined ring assembly ──────────────────────────────── */}
          <div style={{
            position:     "relative",
            width:        "clamp(320px, 42vw, 500px)",
            aspectRatio:  "1",
            flexShrink:   0,
            borderRadius: "50%",

            // Knurled metal texture: repeating-conic creates fine ridges
            background: [
              "radial-gradient(circle at 38% 33%, rgba(80,80,80,0.50) 0%, rgba(0,0,0,0) 48%)",
              "repeating-conic-gradient(from 0deg, #161616 0deg, #2d2d2d 5deg, #161616 10deg)",
            ].join(", "),

            boxShadow: [
              "0 8px 32px rgba(0,0,0,0.90)",
              "0 2px  8px rgba(0,0,0,0.70)",
              "inset 0  1px 0 rgba(255,255,255,0.07)",
              "inset 0 -1px 0 rgba(0,0,0,0.80)",
            ].join(", "),
          }}>

            {/* Lathe groove rings — 7 concentric lines in the ring band */}
            {GROOVES.map((pct) => (
              <div key={pct} style={{
                position:      "absolute",
                width:         `${pct}%`,
                height:        `${pct}%`,
                borderRadius:  "50%",
                border:        `${pct >= 90 ? 1 : 0.6}px solid ${pct >= 88 ? "#242424" : "#1d1d1d"}`,
                left:          `${(100 - pct) / 2}%`,
                top:           `${(100 - pct) / 2}%`,
                pointerEvents: "none",
              }} />
            ))}

            {/* Bolt holes × 4 at 45°/135°/225°/315° */}
            {BOLTS.map((b, i) => (
              <div key={i} style={{
                position:     "absolute",
                width:        `${BOLT_SZ}%`,
                height:       `${BOLT_SZ}%`,
                borderRadius: "50%",
                left:         b.left,
                top:          b.top,
                background:   "radial-gradient(circle at 35% 30%, #2e2e2e, #0a0a0a)",
                border:       "1px solid #222",
                boxShadow:    "inset 0 1px 4px rgba(0,0,0,0.95)",
              }} />
            ))}

            {/* ── Inner VU circle at 65% of ring ────────────────────── */}
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
                background:     "radial-gradient(circle at 44% 38%, #1d1d1d 0%, #0c0c0c 45%, #050505 100%)",
                border:         "2px solid #84cc16",
                boxShadow:      ringGlow,
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
              {/* SVG tick marks — fixed viewBox scales with percentage circle */}
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
                      stroke={isMajor ? "#303030" : "#202020"}
                      strokeWidth={isMajor ? 1.6 : 1}
                    />
                  );
                })}
              </svg>

              {/* VU bars — processing */}
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

              {/* Flat meter line — idle */}
              {panelState === "idle" && (
                <div style={{ width: "40%", height: 1, background: "#2a2a2a", marginBottom: 14, flexShrink: 0 }} />
              )}

              {/* State text */}
              <div style={{ textAlign: "center", padding: "0 14%", zIndex: 1 }}>
                {panelState === "idle" && (
                  <>
                    <div style={{ color: "#b8b8b8", fontSize: "clamp(8px, 0.65vw, 10px)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: 5 }}>
                      Patch In Your Playlist
                    </div>
                    <div style={{ color: "#3c3c3c", fontSize: "clamp(7px, 0.55vw, 9px)", letterSpacing: "0.07em", textTransform: "uppercase", fontFamily: "var(--font-mono)", lineHeight: 1.75 }}>
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

              {/* Physical LED progress segments */}
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
            {/* ── end VU circle ── */}
          </div>
          {/* ── end ring ── */}

          {/* ── SIGNAL INPUT — right of ring ──────────────────────── */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <div style={{
              width:        12,
              height:       12,
              borderRadius: "50%",
              border:       "1px solid #303030",
              background:   signalActive ? "#84cc16" : "#191919",
              boxShadow:    signalActive && panelState !== "idle"
                              ? "0 0 10px rgba(132,204,22,0.95), 0 0 20px rgba(132,204,22,0.45)"
                              : "none",
              animation:    panelState === "idle" ? "led-pulse 2.4s ease-in-out infinite" : "none",
              transition:   "background 0.15s, box-shadow 0.15s",
              flexShrink:   0,
            }} />
            <span style={{
              color:         "#808080",
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
        </div>
        {/* ── end main content row ── */}

        {/* ── PROCESSING — centred below ring ───────────────────────── */}
        <div style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          gap:            12,
          marginTop:      "clamp(16px, 2vw, 24px)",
        }}>
          <div style={{
            width:        10,
            height:       10,
            borderRadius: "50%",
            border:       "1px solid #303030",
            background:   panelState === "processing" ? "#84cc16" : "#161616",
            boxShadow:    panelState === "processing"
                            ? "0 0 10px rgba(132,204,22,0.95), 0 0 20px rgba(132,204,22,0.45)"
                            : "none",
            transition:   "background 0.2s, box-shadow 0.2s",
            flexShrink:   0,
          }} />
          <span style={{
            color:         "#606060",
            fontSize:      10,
            fontWeight:    700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontFamily:    "var(--font-mono)",
          }}>
            Processing
          </span>
        </div>
      </div>

      {/* ── Bottom rack rail ──────────────────────────────────────────── */}
      <div style={{
        height:       7,
        background:   "linear-gradient(0deg, #111, #1d1d1d)",
        borderTop:    "1px solid #2c2c2c",
        boxShadow:    "inset 0 1px 0 rgba(255,255,255,0.02)",
      }} />
    </section>
  );
}
