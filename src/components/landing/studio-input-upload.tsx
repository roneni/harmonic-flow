"use client";

import { useState, useEffect, useRef } from "react";

// ── Screw head — heavier than integration-bar for panel context ────────────
function ScrewHead() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <circle cx="7" cy="7" r="6"   fill="#181818" stroke="#3c3c3c" strokeWidth="0.9" />
      <circle cx="7" cy="7" r="3.8" fill="none"    stroke="#2a2a2a" strokeWidth="0.6" />
      <line x1="3.4" y1="7" x2="10.6" y2="7" stroke="#505050" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

// ── LED segment colours ───────────────────────────────────────────────────
const SEGMENTS = 24;

function segmentColors(index: number, filled: number) {
  if (index >= filled) {
    return { bg: "#0c0c0c", border: "#1c1c1c", shadow: "inset 0 1px 3px rgba(0,0,0,0.95)" };
  }
  const pct = index / SEGMENTS;
  if (pct < 0.6)  return { bg: "#84cc16", border: "#5a8f0e", shadow: "inset 0 1px 0 rgba(255,255,255,0.35), 0 0 7px rgba(132,204,22,0.8)" };
  if (pct < 0.8)  return { bg: "#f59e0b", border: "#a86c07", shadow: "inset 0 1px 0 rgba(255,255,255,0.3),  0 0 7px rgba(245,158,11,0.8)" };
  return             { bg: "#ef4444", border: "#a52020", shadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 0 7px rgba(239,68,68,0.8)" };
}

function vuBarColor(level: number) {
  if (level > 0.82) return "#ef4444";
  if (level > 0.55) return "#f59e0b";
  return "#84cc16";
}

// ── Types ─────────────────────────────────────────────────────────────────
type PanelState = "idle" | "processing" | "complete";

// ── Bolt positions on the machined ring (268px outer, centre at 134,134) ──
const BOLT_RADIUS = 120; // px from centre, sits inside the 28px ring band
const BOLT_DIAM   = 10;
const BOLTS = [0, 90, 180, 270].map((deg) => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return {
    left: 134 + BOLT_RADIUS * Math.cos(rad) - BOLT_DIAM / 2,
    top:  134 + BOLT_RADIUS * Math.sin(rad) - BOLT_DIAM / 2,
  };
});

// ── Component ─────────────────────────────────────────────────────────────
export function StudioInputUpload() {
  const [panelState, setPanelState] = useState<PanelState>("idle");
  const [progress,   setProgress]   = useState(0);
  const [vuBars,     setVuBars]     = useState<number[]>(Array(10).fill(0.08));
  const [ledOn,      setLedOn]      = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const flashRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Progress + VU bars while processing
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
    else if (panelState === "complete") {
      setPanelState("idle");
      setProgress(0);
      setVuBars(Array(10).fill(0.08));
    }
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (panelState === "idle") setPanelState("processing");
  };

  // Derived visuals
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

  // ── Brushed-metal panel background (horizontal striations + depth gradient)
  const panelBg = [
    "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(255,255,255,0.013) 2px, rgba(255,255,255,0.013) 3px)",
    "linear-gradient(180deg, #2d2d2d 0%, #1e1e1e 22%, #242424 50%, #1e1e1e 78%, #2b2b2b 100%)",
  ].join(", ");

  return (
    <section
      aria-label="Studio Input Upload"
      style={{
        background:   panelBg,
        borderTop:    "2px solid #3c3c3c",
        borderBottom: "2px solid #0e0e0e",
        boxShadow:    "inset 0 2px 0 rgba(255,255,255,0.055), inset 0 -2px 0 rgba(0,0,0,0.55)",
      }}
    >
      {/* Top rack rail */}
      <div style={{ height: 7, background: "linear-gradient(180deg, #141414, #1e1e1e)", borderBottom: "1px solid #2a2a2a" }} />

      <div
        className="relative mx-auto"
        style={{ maxWidth: 1280, paddingLeft: 32, paddingRight: 32, paddingTop: 32, paddingBottom: 32 }}
      >
        {/* ── Corner screws ────────────────────────────────────────────── */}
        <span className="absolute top-3 left-5">  <ScrewHead /></span>
        <span className="absolute bottom-3 left-5"><ScrewHead /></span>
        <span className="absolute top-3 right-5">  <ScrewHead /></span>
        <span className="absolute bottom-3 right-5"><ScrewHead /></span>

        {/* ── Panel header ─────────────────────────────────────────────── */}
        <p style={{
          textAlign:      "center",
          marginBottom:   24,
          color:          "#e8e8e8",
          fontSize:       11,
          fontWeight:     700,
          letterSpacing:  "0.35em",
          textTransform:  "uppercase",
          fontFamily:     "var(--font-mono)",
          textShadow:     "0 0 12px rgba(255,255,255,0.15)",
        }}>
          Studio Input Upload
        </p>

        {/* ── Content row ───────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 52 }}>

          {/* ── Machined metal ring assembly ─────────────────────────────── */}
          <div
            style={{
              position:     "relative",
              width:        268,
              height:       268,
              borderRadius: "50%",
              flexShrink:   0,
              // Conic gradient = machined metal knurl effect
              background: [
                "radial-gradient(circle at 37% 31%, rgba(58,58,58,0.7) 0%, transparent 52%)",
                "conic-gradient(from 0deg, #191919, #272727 40deg, #1c1c1c 80deg, #252525 120deg, #181818 160deg, #242424 200deg, #1a1a1a 240deg, #262626 280deg, #1b1b1b 320deg, #252525 360deg)",
              ].join(", "),
              boxShadow: "0 6px 24px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.7)",
            }}
          >
            {/* Machined concentric grooves in the ring band */}
            {[248, 236].map((d, i) => (
              <div
                key={d}
                style={{
                  position:     "absolute",
                  width:        d,
                  height:       d,
                  borderRadius: "50%",
                  border:       `${i === 0 ? 1 : 0.6}px solid ${i === 0 ? "#262626" : "#1e1e1e"}`,
                  left:         (268 - d) / 2,
                  top:          (268 - d) / 2,
                  pointerEvents: "none",
                }}
              />
            ))}

            {/* Bolt holes × 4 at 12 / 3 / 6 / 9 o'clock */}
            {BOLTS.map((b, i) => (
              <div
                key={i}
                style={{
                  position:     "absolute",
                  width:        BOLT_DIAM,
                  height:       BOLT_DIAM,
                  borderRadius: "50%",
                  left:         b.left,
                  top:          b.top,
                  background:   "radial-gradient(circle at 35% 30%, #303030, #0c0c0c)",
                  border:       "1px solid #282828",
                  boxShadow:    "inset 0 1px 3px rgba(0,0,0,0.95)",
                }}
              />
            ))}

            {/* ── Inner VU circle ─────────────────────────────────────── */}
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
                                              "Complete — click to reset"
              }
              style={{
                position:     "absolute",
                width:        212,
                height:       212,
                borderRadius: "50%",
                left:         28,
                top:          28,
                background:   "radial-gradient(circle at 44% 38%, #1c1c1c 0%, #0b0b0b 50%, #060606 100%)",
                border:       "2px solid #84cc16",
                boxShadow:    ringGlow,
                display:      "flex",
                flexDirection: "column",
                alignItems:   "center",
                justifyContent: "center",
                cursor:       panelState === "processing" ? "default" : "pointer",
                transition:   "box-shadow 0.45s ease",
                outline:      "none",
                overflow:     "hidden",
              }}
            >
              {/* SVG tick marks around inner rim */}
              <svg
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
                viewBox="0 0 212 212"
                aria-hidden="true"
              >
                {Array.from({ length: 36 }, (_, i) => {
                  const angle  = (i / 36) * 2 * Math.PI - Math.PI / 2;
                  const isMajor = i % 9 === 0;
                  const r1 = 104, r2 = isMajor ? 94 : 99;
                  const x1 = 106 + r1 * Math.cos(angle), y1 = 106 + r1 * Math.sin(angle);
                  const x2 = 106 + r2 * Math.cos(angle), y2 = 106 + r2 * Math.sin(angle);
                  return (
                    <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke={isMajor ? "#323232" : "#212121"}
                      strokeWidth={isMajor ? 1.4 : 0.8}
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
                <div style={{ width: 88, height: 1, background: "#282828", marginBottom: 14 }} />
              )}

              {/* State text */}
              <div style={{ textAlign: "center", padding: "0 16px", position: "relative", zIndex: 1 }}>
                {panelState === "idle" && (
                  <>
                    <div style={{ color: "#b0b0b0", fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: 5 }}>
                      Patch In Your Playlist
                    </div>
                    <div style={{ color: "#383838", fontSize: 8, letterSpacing: "0.07em", textTransform: "uppercase", fontFamily: "var(--font-mono)", lineHeight: 1.75 }}>
                      Drop XML<br />(Rekordbox, Serato, Traktor)
                    </div>
                  </>
                )}
                {panelState === "processing" && (
                  <>
                    <div style={{ color: "#84cc16", fontSize: 8, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: 3 }}>
                      Analyzing Harmonics...
                    </div>
                    <div style={{ color: "#ffffff", fontSize: 24, fontWeight: 700, fontFamily: "var(--font-mono)", lineHeight: 1, textShadow: "0 0 10px rgba(255,255,255,0.4)" }}>
                      {progress}%
                    </div>
                  </>
                )}
                {panelState === "complete" && (
                  <div style={{ color: "#84cc16", fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", fontFamily: "var(--font-mono)", lineHeight: 1.85, textShadow: "0 0 8px rgba(132,204,22,0.6)" }}>
                    Optimization<br />Complete
                  </div>
                )}
              </div>

              {/* Physical LED progress segments */}
              {panelState !== "idle" && (
                <div style={{ display: "flex", gap: 2, marginTop: 14 }}>
                  {Array.from({ length: SEGMENTS }, (_, i) => {
                    const c = segmentColors(i, filledSegs);
                    return (
                      <div key={i} style={{
                        width:        6,
                        height:       13,
                        borderRadius: 2,
                        background:   c.bg,
                        border:       `1px solid ${c.border}`,
                        boxShadow:    c.shadow,
                        transition:   "background 0.06s, box-shadow 0.06s",
                      }} />
                    );
                  })}
                </div>
              )}
            </div>
            {/* ── end VU circle ── */}
          </div>
          {/* ── end ring assembly ── */}

          {/* ── LED indicator column ─────────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* SIGNAL INPUT */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width:        9,
                height:       9,
                borderRadius: "50%",
                border:       "1px solid #2e2e2e",
                flexShrink:   0,
                background:   signalActive ? "#84cc16" : "#181818",
                boxShadow:    signalActive && panelState !== "idle"
                                ? "0 0 8px rgba(132,204,22,0.9), 0 0 16px rgba(132,204,22,0.4)"
                                : "none",
                animation:    panelState === "idle" ? "led-pulse 2.4s ease-in-out infinite" : "none",
                transition:   "background 0.15s, box-shadow 0.15s",
              }} />
              <span style={{ color: "#606060", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
                Signal Input
              </span>
            </div>

            {/* PROCESSING */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width:        9,
                height:       9,
                borderRadius: "50%",
                border:       "1px solid #2e2e2e",
                flexShrink:   0,
                background:   panelState === "processing" ? "#84cc16" : "#141414",
                boxShadow:    panelState === "processing"
                                ? "0 0 8px rgba(132,204,22,0.9), 0 0 16px rgba(132,204,22,0.4)"
                                : "none",
                transition:   "background 0.2s, box-shadow 0.2s",
              }} />
              <span style={{ color: "#606060", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
                Processing
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom rack rail */}
      <div style={{ height: 7, background: "linear-gradient(0deg, #141414, #1e1e1e)", borderTop: "1px solid #2a2a2a" }} />
    </section>
  );
}
