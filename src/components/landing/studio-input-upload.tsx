"use client";

import { useState, useEffect, useRef } from "react";

// ── Screw head — matches integration-bar.tsx ───────────────────────────────
function ScrewHead() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <circle cx="6" cy="6" r="4.5" fill="none" stroke="#2e2e2e" strokeWidth="0.9" />
      <line x1="3.2" y1="6" x2="8.8" y2="6" stroke="#2e2e2e" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  );
}

// ── Segmented progress bar colours ────────────────────────────────────────
const SEGMENTS = 24;

function segmentFill(index: number, filled: number): string {
  if (index >= filled) return "#161616";
  const pct = index / SEGMENTS;
  if (pct < 0.6) return "#84cc16";
  if (pct < 0.8) return "#f59e0b";
  return "#ef4444";
}

// ── VU bar colour ─────────────────────────────────────────────────────────
function vuColor(level: number): string {
  if (level > 0.82) return "#ef4444";
  if (level > 0.55) return "#f59e0b";
  return "#84cc16";
}

// ── Types ─────────────────────────────────────────────────────────────────
type PanelState = "idle" | "processing" | "complete";

// ── Component ─────────────────────────────────────────────────────────────
export function StudioInputUpload() {
  const [panelState, setPanelState] = useState<PanelState>("idle");
  const [progress, setProgress] = useState(0);
  const [vuBars, setVuBars] = useState<number[]>(Array(10).fill(0.08));
  const [ledOn, setLedOn] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const flashRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Progress + VU animation while processing ───────────────────────────
  useEffect(() => {
    if (panelState !== "processing") return;
    setProgress(0);
    timerRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timerRef.current!);
          setPanelState("complete");
          return 100;
        }
        return p + 1;
      });
      setVuBars(Array(10).fill(0).map(() => 0.12 + Math.random() * 0.88));
    }, 60);
    return () => clearInterval(timerRef.current!);
  }, [panelState]);

  // ── LED flash on complete ──────────────────────────────────────────────
  useEffect(() => {
    if (panelState !== "complete") { setLedOn(true); return; }
    let n = 0;
    flashRef.current = setInterval(() => {
      setLedOn((v) => !v);
      if (++n >= 8) { clearInterval(flashRef.current!); setLedOn(true); }
    }, 260);
    return () => clearInterval(flashRef.current!);
  }, [panelState]);

  // ── Interaction handlers ───────────────────────────────────────────────
  const handleActivate = () => {
    if (panelState === "idle") {
      setPanelState("processing");
    } else if (panelState === "complete") {
      setPanelState("idle");
      setProgress(0);
      setVuBars(Array(10).fill(0.08));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (panelState === "idle") setPanelState("processing");
  };

  // ── Derived visuals ───────────────────────────────────────────────────
  const filledSegments = Math.round((progress / 100) * SEGMENTS);

  const signalLedColor = panelState === "complete" && !ledOn ? "#1a1a1a" : "#84cc16";

  const ringGlow =
    panelState === "idle"
      ? "0 0 10px rgba(132,204,22,0.18), 0 0 22px rgba(132,204,22,0.07)"
      : panelState === "processing"
        ? "0 0 18px rgba(132,204,22,0.55), 0 0 36px rgba(132,204,22,0.25)"
        : ledOn
          ? "0 0 28px rgba(132,204,22,0.85), 0 0 56px rgba(132,204,22,0.35)"
          : "0 0 8px rgba(132,204,22,0.20)";

  const processingLedActive = panelState === "processing";

  return (
    <section
      aria-label="Studio Input Upload"
      style={{
        background: "#111111",
        borderTop: "1px solid #222222",
        borderBottom: "1px solid #222222",
      }}
    >
      <div
        className="relative mx-auto"
        style={{
          maxWidth: 1280,
          paddingLeft: 32,
          paddingRight: 32,
          paddingTop: 44,
          paddingBottom: 44,
        }}
      >
        {/* ── Corner screw heads ──────────────────────────────────────── */}
        <span className="absolute top-3.5 left-5">  <ScrewHead /></span>
        <span className="absolute bottom-3.5 left-5"><ScrewHead /></span>
        <span className="absolute top-3.5 right-5">  <ScrewHead /></span>
        <span className="absolute bottom-3.5 right-5"><ScrewHead /></span>

        {/* ── Panel header ─────────────────────────────────────────────── */}
        <p
          className="text-center mb-8"
          style={{
            color: "#2a2a2a",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontFamily: "var(--font-mono)",
          }}
        >
          Studio Input Upload
        </p>

        {/* ── Main content row ──────────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-12">

          {/* ── Central VU meter circle ─────────────────────────────────── */}
          <div
            role="button"
            tabIndex={0}
            onClick={handleActivate}
            onKeyDown={(e) => e.key === "Enter" && handleActivate()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            aria-label={
              panelState === "idle"
                ? "Click or drop XML file to begin analysis"
                : panelState === "processing"
                  ? `Analyzing: ${progress}%`
                  : "Analysis complete. Click to reset."
            }
            style={{
              position: "relative",
              width: 228,
              height: 228,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 42% 38%, #1c1c1c 0%, #0c0c0c 55%, #080808 100%)",
              border: "2px solid #84cc16",
              boxShadow: ringGlow,
              flexShrink: 0,
              cursor: panelState === "processing" ? "default" : "pointer",
              transition: "box-shadow 0.45s ease",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              userSelect: "none",
              outline: "none",
            }}
          >
            {/* Tick marks around the inner rim */}
            <svg
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
              viewBox="0 0 228 228"
              aria-hidden="true"
            >
              {Array.from({ length: 32 }, (_, i) => {
                const angle = (i / 32) * 2 * Math.PI - Math.PI / 2;
                const r1 = 108, r2 = i % 4 === 0 ? 100 : 104;
                const x1 = 114 + r1 * Math.cos(angle);
                const y1 = 114 + r1 * Math.sin(angle);
                const x2 = 114 + r2 * Math.cos(angle);
                const y2 = 114 + r2 * Math.sin(angle);
                return (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke="#2a2a2a" strokeWidth={i % 4 === 0 ? 1.2 : 0.7} />
                );
              })}
            </svg>

            {/* VU bars — processing */}
            {panelState === "processing" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 3,
                  height: 38,
                  marginBottom: 8,
                }}
              >
                {vuBars.map((v, i) => (
                  <div
                    key={i}
                    style={{
                      width: 7,
                      height: Math.max(3, Math.round(v * 38)),
                      background: vuColor(v),
                      borderRadius: 1,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Flat meter line — idle */}
            {panelState === "idle" && (
              <div
                style={{
                  width: 88,
                  height: 1,
                  background: "#2a2a2a",
                  marginBottom: 14,
                }}
              />
            )}

            {/* State text */}
            <div style={{ textAlign: "center", padding: "0 20px", zIndex: 1 }}>
              {panelState === "idle" && (
                <>
                  <div
                    style={{
                      color: "#999999",
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      fontFamily: "var(--font-mono)",
                      marginBottom: 5,
                    }}
                  >
                    Patch In Your Playlist
                  </div>
                  <div
                    style={{
                      color: "#3a3a3a",
                      fontSize: 8,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      fontFamily: "var(--font-mono)",
                      lineHeight: 1.7,
                    }}
                  >
                    Drop XML<br />(Rekordbox, Serato, Traktor)
                  </div>
                </>
              )}

              {panelState === "processing" && (
                <>
                  <div
                    style={{
                      color: "#84cc16",
                      fontSize: 8,
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      fontFamily: "var(--font-mono)",
                      marginBottom: 3,
                    }}
                  >
                    Analyzing Harmonics...
                  </div>
                  <div
                    style={{
                      color: "#ffffff",
                      fontSize: 24,
                      fontWeight: 700,
                      fontFamily: "var(--font-mono)",
                      lineHeight: 1,
                    }}
                  >
                    {progress}%
                  </div>
                </>
              )}

              {panelState === "complete" && (
                <div
                  style={{
                    color: "#84cc16",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-mono)",
                    lineHeight: 1.8,
                  }}
                >
                  Optimization<br />Complete
                </div>
              )}
            </div>

            {/* Segmented progress bar */}
            {panelState !== "idle" && (
              <div
                style={{
                  display: "flex",
                  gap: 2,
                  marginTop: 12,
                }}
              >
                {Array.from({ length: SEGMENTS }, (_, i) => (
                  <div
                    key={i}
                    style={{
                      width: 5,
                      height: 8,
                      borderRadius: 1,
                      background: segmentFill(i, filledSegments),
                      transition: "background 0.06s",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── LED indicators ──────────────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* SIGNAL INPUT */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: signalLedColor,
                  boxShadow:
                    panelState === "idle"
                      ? undefined
                      : `0 0 7px ${signalLedColor}`,
                  animation:
                    panelState === "idle"
                      ? "led-pulse 2.4s ease-in-out infinite"
                      : "none",
                  transition: "background 0.15s, box-shadow 0.15s",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  color: "#2e2e2e",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontFamily: "var(--font-mono)",
                }}
              >
                Signal Input
              </span>
            </div>

            {/* PROCESSING */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: processingLedActive ? "#84cc16" : "#161616",
                  boxShadow: processingLedActive ? "0 0 7px #84cc16" : "none",
                  transition: "background 0.2s, box-shadow 0.2s",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  color: "#2e2e2e",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontFamily: "var(--font-mono)",
                }}
              >
                Processing
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
