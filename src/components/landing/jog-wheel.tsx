"use client";

import { useRef, useCallback } from "react";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";

// Circle of Fifths keys — clockwise from top (12 o'clock = index 0)
const MAJOR_KEYS = ["C", "G", "D", "A", "E", "B", "F#", "Db", "Ab", "Eb", "Bb", "F"];
const MINOR_KEYS = ["Am", "Em", "Bm", "F#m", "C#m", "G#m", "Ebm", "Bbm", "Fm", "Cm", "Gm", "Dm"];

const SIZE = 380;
const GROOVE_RADII = [172, 160, 148, 136, 124, 112, 100, 88, 76, 64];
const MAJOR_RADIUS = 155;
const MINOR_RADIUS = 122;
const SEPARATOR_RADIUS = 138;

// Auto-rotation: 360° per 8 000 ms  → 0.045 deg/ms
const AUTO_DEG_PER_MS = 360 / 8000;
// Momentum deceleration per frame (multiplied each ~16 ms tick)
const DECAY = 0.95;
const VELOCITY_THRESHOLD = 0.05;

export function JogWheel() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rotation = useMotionValue(0);
  const isDragging = useRef(false);
  const lastAngle = useRef(0);
  const velocity = useRef(0);
  const lastTimestamp = useRef(0);

  // ── Auto-rotation + momentum decay ────────────────────────────────────────
  useAnimationFrame((_, delta) => {
    if (isDragging.current) return;

    if (Math.abs(velocity.current) > VELOCITY_THRESHOLD) {
      velocity.current *= DECAY;
      rotation.set(rotation.get() + velocity.current);
    } else {
      velocity.current = 0;
      rotation.set(rotation.get() + AUTO_DEG_PER_MS * delta);
    }
  });

  // ── Angle helpers ──────────────────────────────────────────────────────────
  const getAngle = useCallback((clientX: number, clientY: number): number => {
    if (!wrapperRef.current) return 0;
    const rect = wrapperRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI);
  }, []);

  // ── Pointer events ─────────────────────────────────────────────────────────
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      isDragging.current = true;
      velocity.current = 0;
      lastAngle.current = getAngle(e.clientX, e.clientY);
      lastTimestamp.current = e.timeStamp;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [getAngle]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      const angle = getAngle(e.clientX, e.clientY);
      const now = e.timeStamp;
      let delta = angle - lastAngle.current;
      // Normalise to [-180, 180] to avoid 360° jump artefacts
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      const dt = now - lastTimestamp.current;
      if (dt > 0) {
        // Scale velocity to a ~60 fps equivalent frame
        velocity.current = (delta / dt) * 16;
      }
      rotation.set(rotation.get() + delta);
      lastAngle.current = angle;
      lastTimestamp.current = now;
    },
    [getAngle, rotation]
  );

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    /* Perspective container — gives the platter its tilted 3-D look */
    <div style={{ perspective: "800px" }}>
      <div
        style={{
          transform: "rotateX(15deg)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Drag target — captures pointer events before the SVG */}
        <div
          ref={wrapperRef}
          style={{
            width: SIZE,
            height: SIZE,
            cursor: "grab",
            userSelect: "none",
            // Lime green outer glow
            filter:
              "drop-shadow(0 0 24px rgba(132, 204, 22, 0.35)) drop-shadow(0 0 8px rgba(132, 204, 22, 0.2))",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <motion.div style={{ rotate: rotation, width: "100%", height: "100%" }}>
            <svg
              viewBox="-190 -190 380 380"
              width={SIZE}
              height={SIZE}
              aria-label="Circle of Fifths jog wheel"
            >
              <defs>
                {/* Platter radial gradient — dark centre, slightly lighter rim */}
                <radialGradient id="platter" cx="40%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#2e2e2e" />
                  <stop offset="60%" stopColor="#1a1a1a" />
                  <stop offset="100%" stopColor="#111111" />
                </radialGradient>

                {/* Hub gradient */}
                <radialGradient id="hub" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#333333" />
                  <stop offset="100%" stopColor="#0f0f0f" />
                </radialGradient>

                {/* Conic shimmer on the platter surface */}
                <filter id="noise" x="0%" y="0%" width="100%" height="100%">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.65"
                    numOctaves="3"
                    stitchTiles="stitch"
                    result="noise"
                  />
                  <feColorMatrix
                    type="saturate"
                    values="0"
                    in="noise"
                    result="grayNoise"
                  />
                  <feBlend in="SourceGraphic" in2="grayNoise" mode="overlay" result="blended" />
                  <feComposite in="blended" in2="SourceGraphic" operator="in" />
                </filter>
              </defs>

              {/* ── Outer lime green ring ─────────────────────────────────── */}
              <circle r={187} fill="none" stroke="#84cc16" strokeWidth="2.5" opacity="0.9" />
              <circle r={183} fill="none" stroke="#84cc16" strokeWidth="0.5" opacity="0.4" />

              {/* ── Main platter surface ──────────────────────────────────── */}
              <circle r={181} fill="url(#platter)" />

              {/* ── Groove rings ─────────────────────────────────────────── */}
              {GROOVE_RADII.map((r) => (
                <circle
                  key={r}
                  r={r}
                  fill="none"
                  stroke="#2a2a2a"
                  strokeWidth="0.6"
                />
              ))}

              {/* ── Separator ring between major and minor labels ─────────── */}
              <circle
                r={SEPARATOR_RADIUS}
                fill="none"
                stroke="#2e2e2e"
                strokeWidth="1.5"
              />

              {/* ── Major key labels ─────────────────────────────────────── */}
              {MAJOR_KEYS.map((key, i) => {
                const angleDeg = i * 30;
                const angleRad = (angleDeg * Math.PI) / 180;
                const x = Math.sin(angleRad) * MAJOR_RADIUS;
                const y = -Math.cos(angleRad) * MAJOR_RADIUS;
                return (
                  <text
                    key={key}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="11"
                    fontWeight="700"
                    fontFamily="Inter, ui-sans-serif, sans-serif"
                    fill="#ffffff"
                    letterSpacing="0.5"
                    transform={`rotate(${angleDeg}, ${x}, ${y})`}
                  >
                    {key}
                  </text>
                );
              })}

              {/* ── Minor key labels ─────────────────────────────────────── */}
              {MINOR_KEYS.map((key, i) => {
                const angleDeg = i * 30;
                const angleRad = (angleDeg * Math.PI) / 180;
                const x = Math.sin(angleRad) * MINOR_RADIUS;
                const y = -Math.cos(angleRad) * MINOR_RADIUS;
                return (
                  <text
                    key={key}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="9"
                    fontWeight="400"
                    fontFamily="Inter, ui-sans-serif, sans-serif"
                    fill="#888888"
                    transform={`rotate(${angleDeg}, ${x}, ${y})`}
                  >
                    {key}
                  </text>
                );
              })}

              {/* ── Centre hub ───────────────────────────────────────────── */}
              <circle r={38} fill="url(#hub)" stroke="#2a2a2a" strokeWidth="1" />
              <circle r={24} fill="#111111" stroke="#333333" strokeWidth="1" />
              {/* Lime green centre spindle dot */}
              <circle r={5} fill="#84cc16" />
              {/* Subtle highlight on hub */}
              <circle r={38} fill="none" stroke="#3a3a3a" strokeWidth="0.5" />

              {/* ── 12 o'clock position marker ───────────────────────────── */}
              <line
                x1="0"
                y1="-175"
                x2="0"
                y2="-165"
                stroke="#84cc16"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.7"
              />
            </svg>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
