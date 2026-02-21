"use client";

import { useState, useEffect, useRef } from "react";

// ── Shared brushed-metal surface (also used in integration-bar.tsx) ────────
export const BRUSHED_METAL_BG = [
  "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(255,255,255,0.013) 2px, rgba(255,255,255,0.013) 3px)",
  "linear-gradient(180deg, #2d2d2d 0%, #1e1e1e 22%, #242424 50%, #1e1e1e 78%, #2b2b2b 100%)",
].join(", ");

// ── Screw head ─────────────────────────────────────────────────────────────
function ScrewHead() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <circle cx="7" cy="7" r="6"   fill="#181818" stroke="#3c3c3c" strokeWidth="0.9" />
      <circle cx="7" cy="7" r="3.8" fill="none"    stroke="#2a2a2a" strokeWidth="0.6" />
      <line x1="3.4" y1="7" x2="10.6" y2="7" stroke="#505050" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

// ── LED segment colours ────────────────────────────────────────────────────
const SEGMENTS = 24;

function segmentColors(index: number, filled: number) {
  if (index >= filled) return { bg: "#0c0c0c", border: "#1c1c1c", shadow: "inset 0 1px 3px rgba(0,0,0,0.95)" };
  const pct = index / SEGMENTS;
  if (pct < 0.6) return { bg: "#84cc16", border: "#5a8f0e", shadow: "inset 0 1px 0 rgba(255,255,255,0.35), 0 0 7px rgba(132,204,22,0.8)"  };
  if (pct < 0.8) return { bg: "#f59e0b", border: "#a86c07", shadow: "inset 0 1px 0 rgba(255,255,255,0.30), 0 0 7px rgba(245,158,11,0.8)"  };
  return               { bg: "#ef4444", border: "#a52020", shadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 0 7px rgba(239,68,68,0.8)"   };
}

function vuBarColor(level: number) {
  if (level > 0.82) return "#ef4444";
  if (level > 0.55) return "#f59e0b";
  return "#84cc16";
}

// ── Types ──────────────────────────────────────────────────────────────────
type PanelState = "idle" | "processing" | "complete";

// ── Bolt positions: diagonal corners (45°/135°/225°/315°) as % of ring ────
// Ring band spans from 39.65% radius (VU edge) to 50% (ring edge).
// Bolts sit at 44% radius — well inside the band.
const BOLT_R   = 44;   // % from ring centre
const BOLT_SZ  = 3.8;  // % of ring size (bolt hole diameter)

const BOLTS = [45, 135, 225, 315].map((deg) => {
  const rad = ((deg - 90) * Math.PI) / 180;
  const cx  = 50 + BOLT_R * Math.cos(rad);
  const cy  = 50 + BOLT_R * Math.sin(rad);
  return { left: `${(cx - BOLT_SZ / 2).toFixed(2)}%`, top: `${(cy - BOLT_SZ / 2).toFixed(2)}%` };
});

// ── Component ──────────────────────────────────────────────────────────────
export function StudioInputUpload() {
  const [panelState, setPanelState] = useState<PanelState>("idle");
  const [progress,   setProgress]   = useState(0);
  const [vuBars,     setVuBars]     = useState<number[]>(Array(10).fill(0.08));
  const [ledOn,      setLedOn]      = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const flashRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Progress + VU animation
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

  // LED flash on complete
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
      ? "0 0 10px rgba(132,204,22,0.18), 0 0 22px rgba(132,204,22,0.06)"
      : panelState === "processing"
        ? "0 0 20px rgba(132,204,22,0.60), 0 0 40px rgba(132,204,22,0.25)"
        : ledOn
          ? "0 0 28px rgba(132,204,22,0.90), 0 0 56px rgba(132,204,22,0.38)"
          : "0 0 6px rgba(132,204,22,0.18)";

  return (
    <section
      aria-label="Studio Input Upload"
      style={{
        background:   BRUSHED_METAL_BG,
        borderTop:    "2px solid #3c3c3c",
        borderBottom: "2px solid #0e0e0e",
        boxShadow:    "inset 0 2px 0 rgba(255,255,255,0.055), inset 0 -2px 0 rgba(0,0,0,0.55)",
      }}
    >
      {/* Top rack rail */}
      <div style={{ height: 7, background: "linear-gradient(180deg,#141414,#1e1e1e)", borderBottom: "1px solid #2a2a2a" }} />

      {/*
        Padding maths: circle ≈ 65% of panel-content height.
        panel-content = paddingTop + header(≈46px) + gap(24px) + ringSize + paddingBottom
        At 1280px: ring = 440px, padding = 88px each → total = 88+46+24+440+88 = 686px → 440/686 = 64% ✓
        At 1024px: ring = 358px, padding = 82px each → total = 82+40+20+358+82 = 582px → 358/582 = 62% ✓
      */}
      <div
        className="relative mx-auto"
        style={{
          maxWidth:      1280,
          paddingLeft:   "clamp(24px, 3vw, 40px)",
          paddingRight:  "clamp(24px, 3vw, 40px)",
          paddingTop:    "clamp(56px, 7vw, 88px)",
          paddingBottom: "clamp(56px, 7vw, 88px)",
        }}
      >
        {/* Corner screws */}
        <span className="absolute top-3 left-5">  <ScrewHead /></span>
        <span className="absolute bottom-3 left-5"><ScrewHead /></span>
        <span className="absolute top-3 right-5">  <ScrewHead /></span>
        <span className="absolute bottom-3 right-5"><ScrewHead /></span>

        {/* ── Panel header ──────────────────────────────────────────────── */}
        <p style={{
          textAlign:     "center",
          marginBottom:  "clamp(14px, 2vw, 24px)",
          color:         "#ffffff",
          fontSize:      "clamp(12px, 1.3vw, 17px)",
          fontWeight:    700,
          letterSpacing: "0.38em",
          textTransform: "uppercase",
          fontFamily:    "var(--font-mono)",
          textShadow:    "0 0 14px rgba(255,255,255,0.18)",
        }}>
          Studio Input Upload
        </p>

        {/* ── Content row ───────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "clamp(24px, 4vw, 52px)" }}>

          {/* ── Machined metal ring — all children sized as % of this box ── */}
          <div style={{
            position:     "relative",
            width:        "clamp(300px, 35vw, 440px)",
            aspectRatio:  "1",
            flexShrink:   0,
            borderRadius: "50%",
            background: [
              "radial-gradient(circle at 37% 31%, rgba(58,58,58,0.65) 0%, transparent 50%)",
              "conic-gradient(from 0deg, #191919, #272727 40deg, #1c1c1c 80deg, #252525 120deg, #181818 160deg, #242424 200deg, #1a1a1a 240deg, #262626 280deg, #1b1b1b 320deg, #252525 360deg)",
            ].join(", "),
            boxShadow: "0 6px 28px rgba(0,0,0,0.88), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.7)",
          }}>

            {/* Machined concentric groove rings */}
            {[92, 85].map((pct) => (
              <div key={pct} style={{
                position:     "absolute",
                width:        `${pct}%`,
                height:       `${pct}%`,
                borderRadius: "50%",
                border:       `1px solid ${pct === 92 ? "#272727" : "#1e1e1e"}`,
                left:         `${(100 - pct) / 2}%`,
                top:          `${(100 - pct) / 2}%`,
                pointerEvents: "none",
              }} />
            ))}

            {/* Bolt holes at 45° / 135° / 225° / 315° */}
            {BOLTS.map((b, i) => (
              <div key={i} style={{
                position:     "absolute",
                width:        `${BOLT_SZ}%`,
                height:       `${BOLT_SZ}%`,
                borderRadius: "50%",
                left:         b.left,
                top:          b.top,
                background:   "radial-gradient(circle at 35% 30%, #303030, #0c0c0c)",
                border:       "1px solid #282828",
                boxShadow:    "inset 0 1px 3px rgba(0,0,0,0.95)",
              }} />
            ))}

            {/* ── Inner VU circle — 79.3% of ring (preserves 212/268 ratio) ── */}
            <div
              role="button"
              tabIndex={0}
              onClick={handleActivate}
              onKeyDown={(e) => e.key === "Enter" && handleActivate()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              aria-label={
                panelState === "idle"       ? "Click or drop XML file to begin analysis" :
                panelState === "processing" ? `Analyzing: ${progress}%` :
                                              "Optimization complete — click to reset"
              }
              style={{
                position:       "absolute",
                width:          "79.3%",
                height:         "79.3%",
                borderRadius:   "50%",
                left:           "10.35%",
                top:            "10.35%",
                background:     "radial-gradient(circle at 44% 38%, #1c1c1c 0%, #0b0b0b 50%, #060606 100%)",
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
              {/* Tick marks — fixed viewBox scales with the % circle */}
              <svg
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
                viewBox="0 0 212 212"
                aria-hidden="true"
              >
                {Array.from({ length: 36 }, (_, i) => {
                  const angle   = (i / 36) * 2 * Math.PI - Math.PI / 2;
                  const isMajor = i % 9 === 0;
                  const r1 = 104, r2 = isMajor ? 93 : 99;
                  const x1 = 106 + r1 * Math.cos(angle), y1 = 106 + r1 * Math.sin(angle);
                  const x2 = 106 + r2 * Math.cos(angle), y2 = 106 + r2 * Math.sin(angle);
                  return (
                    <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke={isMajor ? "#323232" : "#212121"}
                      strokeWidth={isMajor ? 1.5 : 0.9}
                    />
                  );
                })}
              </svg>

              {/* VU bars — processing */}
              {panelState === "processing" && (
                <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 38, marginBottom: 6 }}>
                  {vuBars.map((v, i) => (
                    <div key={i} style={{
                      width:        7,
                      height:       Math.max(3, Math.round(v * 38)),
                      background:   vuBarColor(v),
                      borderRadius: 1,
                      boxShadow:    `0 0 5px ${vuBarColor(v)}`,
                    }} />
                  ))}
                </div>
              )}

              {/* Flat meter line — idle */}
              {panelState === "idle" && (
                <div style={{ width: "42%", height: 1, background: "#282828", marginBottom: 14 }} />
              )}

              {/* State text */}
              <div style={{ textAlign: "center", padding: "0 15%", position: "relative", zIndex: 1 }}>
                {panelState === "idle" && (
                  <>
                    <div style={{ color: "#b0b0b0", fontSize: "clamp(8px, 0.65vw, 10px)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: 5 }}>
                      Patch In Your Playlist
                    </div>
                    <div style={{ color: "#383838", fontSize: "clamp(7px, 0.55vw, 9px)", letterSpacing: "0.07em", textTransform: "uppercase", fontFamily: "var(--font-mono)", lineHeight: 1.75 }}>
                      Drop XML<br />(Rekordbox, Serato, Traktor)
                    </div>
                  </>
                )}
                {panelState === "processing" && (
                  <>
                    <div style={{ color: "#84cc16", fontSize: "clamp(7px, 0.6vw, 9px)", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: 4 }}>
                      Analyzing Harmonics...
                    </div>
                    <div style={{ color: "#ffffff", fontSize: "clamp(20px, 2.4vw, 30px)", fontWeight: 700, fontFamily: "var(--font-mono)", lineHeight: 1, textShadow: "0 0 12px rgba(255,255,255,0.4)" }}>
                      {progress}%
                    </div>
                  </>
                )}
                {panelState === "complete" && (
                  <div style={{ color: "#84cc16", fontSize: "clamp(8px, 0.7vw, 10px)", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", fontFamily: "var(--font-mono)", lineHeight: 1.85, textShadow: "0 0 8px rgba(132,204,22,0.6)" }}>
                    Optimization<br />Complete
                  </div>
                )}
              </div>

              {/* Physical LED progress segments — width scales with viewport */}
              {panelState !== "idle" && (
                <div style={{ display: "flex", gap: "clamp(1px, 0.14vw, 2px)", marginTop: 14 }}>
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
          {/* ── end ring assembly ── */}

          {/* ── LED indicator column ──────────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

            {/* SIGNAL INPUT */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 10, height: 10, borderRadius: "50%",
                border: "1px solid #2e2e2e", flexShrink: 0,
                background:  signalActive ? "#84cc16" : "#181818",
                boxShadow:   signalActive && panelState !== "idle" ? "0 0 8px rgba(132,204,22,0.9), 0 0 16px rgba(132,204,22,0.4)" : "none",
                animation:   panelState === "idle" ? "led-pulse 2.4s ease-in-out infinite" : "none",
                transition:  "background 0.15s, box-shadow 0.15s",
              }} />
              <span style={{ color: "#707070", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
                Signal Input
              </span>
            </div>

            {/* PROCESSING */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 10, height: 10, borderRadius: "50%",
                border: "1px solid #2e2e2e", flexShrink: 0,
                background: panelState === "processing" ? "#84cc16" : "#141414",
                boxShadow:  panelState === "processing" ? "0 0 8px rgba(132,204,22,0.9), 0 0 16px rgba(132,204,22,0.4)" : "none",
                transition: "background 0.2s, box-shadow 0.2s",
              }} />
              <span style={{ color: "#707070", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
                Processing
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom rack rail */}
      <div style={{ height: 7, background: "linear-gradient(0deg,#141414,#1e1e1e)", borderTop: "1px solid #2a2a2a" }} />
    </section>
  );
}
