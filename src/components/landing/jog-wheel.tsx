"use client";

import { useRef, useCallback, useState } from "react";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";

// ── Key positions — clockwise from 12 o'clock (index 0 = C / Am) ─────────────
// Compatible keys per Camelot mixing rules: same position ± 1 step
interface KeyPos {
  major: string;
  majorAlt?: string; // enharmonic major
  minor: string;
  minorAlt?: string; // enharmonic minor
}

const KEYS: KeyPos[] = [
  { major: "C", minor: "Am" },
  { major: "G", minor: "Em" },
  { major: "D", minor: "Bm" },
  { major: "A", minor: "F#m", minorAlt: "Gbm" },
  { major: "E", minor: "C#m", minorAlt: "Dbm" },
  { major: "B", majorAlt: "Cb", minor: "G#m", minorAlt: "Abm" },
  { major: "F#", majorAlt: "Gb", minor: "Ebm", minorAlt: "D#m" },
  { major: "Db", majorAlt: "C#", minor: "Bbm" },
  { major: "Ab", majorAlt: "G#", minor: "Fm" },
  { major: "Eb", majorAlt: "D#", minor: "Cm" },
  { major: "Bb", majorAlt: "A#", minor: "Gm" },
  { major: "F", minor: "Dm" },
];

// ── Dimensions (viewBox: -210 to 210) ────────────────────────────────────────
const SIZE = 420;
const VB = 210;

const RING_OUTER = 207; // metallic knurled ring outer edge
const RING_INNER = 177; // metallic ring inner edge
const LIME_R = 175; // lime green accent ring
const KEY_OUTER = 173; // key segment zone outer
const KEY_INNER = 108; // key segment zone inner
const MAJOR_R = 163; // major key text radius
const MAJOR_ALT_R = 152; // enharmonic major text radius
const DIV_R = 142; // separator ring radius
const MINOR_R = 131; // minor key text radius
const MINOR_ALT_R = 119; // enharmonic minor text radius
const PLATTER_R = 105; // dark vinyl platter
const HUB_R = 46; // centre hub
const HUB2_R = 28; // inner hub ring
const SPINDLE_R = 8; // centre spindle dot

const GAP_DEG = 0.8; // visual gap between segments

// ── Physics constants ─────────────────────────────────────────────────────────
const AUTO_DEG_PER_MS = 360 / 8000; // 1 full rotation per 8 s
const DECAY = 0.95;
const VEL_THRESHOLD = 0.05;

// ── Helpers ───────────────────────────────────────────────────────────────────
/** Convert clockwise-from-top angle to SVG [x, y] at radius r */
function pt(angleDeg: number, r: number): [number, number] {
  const rad = (angleDeg * Math.PI) / 180;
  return [
    Number((Math.sin(rad) * r).toFixed(4)),
    Number((-Math.cos(rad) * r).toFixed(4))
  ];
}

/** SVG path for an annular sector (ring slice) */
function segPath(i: number, innerR: number, outerR: number): string {
  const s = i * 30 + GAP_DEG / 2;
  const e = (i + 1) * 30 - GAP_DEG / 2;
  const [ox1, oy1] = pt(s, outerR);
  const [ox2, oy2] = pt(e, outerR);
  const [ix2, iy2] = pt(e, innerR);
  const [ix1, iy1] = pt(s, innerR);
  return (
    `M ${ox1} ${oy1} ` +
    `A ${outerR} ${outerR} 0 0 1 ${ox2} ${oy2} ` +
    `L ${ix2} ${iy2} ` +
    `A ${innerR} ${innerR} 0 0 0 ${ix1} ${iy1} Z`
  );
}

/** Compatible segment indices for a hovered segment */
function getCompatible(i: number | null): Set<number> {
  if (i === null) return new Set();
  return new Set([(i + 11) % 12, i, (i + 1) % 12]);
}

// ── Component ─────────────────────────────────────────────────────────────────
export function JogWheel() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rotation = useMotionValue(0);
  const isDragging = useRef(false);
  const lastAngle = useRef(0);
  const velocity = useRef(0);
  const lastTimestamp = useRef(0);

  const [hovered, setHovered] = useState<number | null>(null);
  const compatible = getCompatible(hovered);

  // ── Auto-rotation + momentum decay ─────────────────────────────────────────
  useAnimationFrame((_, delta) => {
    if (isDragging.current) return;
    if (Math.abs(velocity.current) > VEL_THRESHOLD) {
      velocity.current *= DECAY;
      rotation.set(rotation.get() + velocity.current);
    } else {
      velocity.current = 0;
      rotation.set(rotation.get() + AUTO_DEG_PER_MS * delta);
    }
  });

  // ── Drag helpers ────────────────────────────────────────────────────────────
  const getAngle = useCallback((clientX: number, clientY: number): number => {
    if (!wrapperRef.current) return 0;
    const rect = wrapperRef.current.getBoundingClientRect();
    return (
      Math.atan2(clientY - (rect.top + rect.height / 2), clientX - (rect.left + rect.width / 2)) *
      (180 / Math.PI)
    );
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      isDragging.current = true;
      velocity.current = 0;
      setHovered(null);
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
      let delta = angle - lastAngle.current;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      const dt = e.timeStamp - lastTimestamp.current;
      if (dt > 0) velocity.current = (delta / dt) * 16;
      rotation.set(rotation.get() + delta);
      lastAngle.current = angle;
      lastTimestamp.current = e.timeStamp;
    },
    [getAngle, rotation]
  );

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // ── Colour helpers (depend on hover state) ──────────────────────────────────
  const segFill = (i: number) => {
    if (hovered === null) return "#161616";
    if (i === hovered) return "#1c2d00";
    if (compatible.has(i)) return "#131f00";
    return "#0d0d0d";
  };
  const majorFill = (i: number) => {
    if (hovered === null) return "#e8e8e8";
    if (i === hovered) return "#84cc16";
    if (compatible.has(i)) return "#a3e635";
    return "#2a2a2a";
  };
  const minorFill = (i: number) => {
    if (hovered === null) return "#999999";
    if (i === hovered) return "#65a30d";
    if (compatible.has(i)) return "#84cc16";
    return "#1e1e1e";
  };
  const altFill = (i: number) => {
    if (hovered === null) return "#4a4a4a";
    if (i === hovered) return "#3f6212";
    if (compatible.has(i)) return "#4d7c0f";
    return "#161616";
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ perspective: "800px" }}>
      <div style={{ transform: "rotateX(15deg)", transformStyle: "preserve-3d" }}>
        <div
          ref={wrapperRef}
          style={{
            width: SIZE,
            height: SIZE,
            cursor: "grab",
            userSelect: "none",
            filter:
              "drop-shadow(0 0 32px rgba(132,204,22,0.28)) drop-shadow(0 0 10px rgba(132,204,22,0.16))",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <motion.div style={{ rotate: rotation, width: "100%", height: "100%" }}>
            <svg
              viewBox={`-${VB} -${VB} ${VB * 2} ${VB * 2}`}
              width={SIZE}
              height={SIZE}
              role="img"
              aria-label="Circle of Fifths jog wheel showing harmonic key relationships"
            >
              <defs>
                {/* Platter surface — dark off-centre radial gradient for vinyl depth */}
                <radialGradient id="jw-platter" cx="42%" cy="38%" r="62%">
                  <stop offset="0%" stopColor="#252525" />
                  <stop offset="55%" stopColor="#161616" />
                  <stop offset="100%" stopColor="#0c0c0c" />
                </radialGradient>

                {/* Metallic outer ring */}
                <radialGradient id="jw-ring" cx="50%" cy="0%" r="120%">
                  <stop offset="0%" stopColor="#383838" />
                  <stop offset="40%" stopColor="#1c1c1c" />
                  <stop offset="100%" stopColor="#111111" />
                </radialGradient>

                {/* Hub */}
                <radialGradient id="jw-hub" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#383838" />
                  <stop offset="100%" stopColor="#080808" />
                </radialGradient>

                {/* Vinyl noise texture */}
                <filter id="jw-vinyl" x="-2%" y="-2%" width="104%" height="104%">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.75"
                    numOctaves="4"
                    stitchTiles="stitch"
                    result="noise"
                  />
                  <feColorMatrix type="saturate" values="0" in="noise" result="grey" />
                  <feBlend in="SourceGraphic" in2="grey" mode="multiply" result="blended" />
                  <feComposite in="blended" in2="SourceGraphic" operator="in" />
                </filter>

                {/* Clip the vinyl texture to the platter circle */}
                <clipPath id="jw-platter-clip">
                  <circle r={PLATTER_R} />
                </clipPath>
              </defs>

              {/* ── Outer metallic knurled ring ─────────────────────────────── */}
              <circle r={RING_OUTER} fill="url(#jw-ring)" />

              {/* Knurl ridges — 72 alternating lines every 5° */}
              {Array.from({ length: 72 }, (_, k) => {
                const [x1, y1] = pt(k * 5, RING_INNER + 3);
                const [x2, y2] = pt(k * 5, RING_OUTER - 3);
                return (
                  <line
                    key={k}
                    x1={x1} y1={y1}
                    x2={x2} y2={y2}
                    stroke={k % 2 === 0 ? "#2c2c2c" : "#0e0e0e"}
                    strokeWidth="1.5"
                  />
                );
              })}

              {/* Ring edge lines */}
              <circle r={RING_OUTER} fill="none" stroke="#3e3e3e" strokeWidth="0.8" />
              <circle r={RING_INNER} fill="none" stroke="#1e1e1e" strokeWidth="1.2" />

              {/* ── Lime green accent band ──────────────────────────────────── */}
              <circle r={LIME_R} fill="none" stroke="#84cc16" strokeWidth="2.5" opacity="0.9" />
              <circle r={LIME_R - 3} fill="none" stroke="#84cc16" strokeWidth="0.6" opacity="0.3" />

              {/* ── 12 interactive key segments ────────────────────────────── */}
              {KEYS.map((key, i) => {
                const center = i * 30 + 15; // midpoint angle of segment
                const [mjX, mjY] = pt(center, MAJOR_R);
                const [maX, maY] = pt(center, MAJOR_ALT_R);
                const [mnX, mnY] = pt(center, MINOR_R);
                const [mnAX, mnAY] = pt(center, MINOR_ALT_R);
                // Radial divider at segment start
                const [divI_x, divI_y] = pt(i * 30, KEY_INNER);
                const [divO_x, divO_y] = pt(i * 30, KEY_OUTER);

                return (
                  <g
                    key={i}
                    onPointerEnter={() => !isDragging.current && setHovered(i)}
                    onPointerLeave={() => !isDragging.current && setHovered(null)}
                    style={{ cursor: "default" }}
                  >
                    {/* Segment fill */}
                    <path
                      d={segPath(i, KEY_INNER, KEY_OUTER)}
                      fill={segFill(i)}
                    />

                    {/* Radial divider line */}
                    <line
                      x1={divI_x} y1={divI_y}
                      x2={divO_x} y2={divO_y}
                      stroke="#242424"
                      strokeWidth="0.8"
                    />

                    {/* Major key */}
                    <text
                      x={mjX} y={mjY}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={key.majorAlt ? "11" : "13"}
                      fontWeight="700"
                      fontFamily="Inter, ui-sans-serif, sans-serif"
                      fill={majorFill(i)}
                      transform={`rotate(${center}, ${mjX}, ${mjY})`}
                    >
                      {key.major}
                    </text>

                    {/* Enharmonic major */}
                    {key.majorAlt && (
                      <text
                        x={maX} y={maY}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="8"
                        fontWeight="400"
                        fontFamily="Inter, ui-sans-serif, sans-serif"
                        fill={altFill(i)}
                        transform={`rotate(${center}, ${maX}, ${maY})`}
                      >
                        {key.majorAlt}
                      </text>
                    )}

                    {/* Minor key */}
                    <text
                      x={mnX} y={mnY}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={key.minorAlt ? "10" : "11"}
                      fontWeight="500"
                      fontFamily="Inter, ui-sans-serif, sans-serif"
                      fill={minorFill(i)}
                      transform={`rotate(${center}, ${mnX}, ${mnY})`}
                    >
                      {key.minor}
                    </text>

                    {/* Enharmonic minor */}
                    {key.minorAlt && (
                      <text
                        x={mnAX} y={mnAY}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="8"
                        fontWeight="400"
                        fontFamily="Inter, ui-sans-serif, sans-serif"
                        fill={altFill(i)}
                        transform={`rotate(${center}, ${mnAX}, ${mnAY})`}
                      >
                        {key.minorAlt}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* ── Major / minor separator ring ───────────────────────────── */}
              <circle r={DIV_R} fill="none" stroke="#252525" strokeWidth="1.2" />

              {/* ── Dark vinyl platter ─────────────────────────────────────── */}
              {/* Base fill */}
              <circle r={PLATTER_R} fill="url(#jw-platter)" />
              {/* Noise texture overlay */}
              <circle r={PLATTER_R} fill="url(#jw-platter)" filter="url(#jw-vinyl)" opacity="0.4" />

              {/* ── Vinyl groove rings ─────────────────────────────────────── */}
              {[100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50].map((r) => (
                <circle
                  key={r}
                  r={r}
                  fill="none"
                  stroke="#1e1e1e"
                  strokeWidth={r % 10 === 0 ? "0.9" : "0.4"}
                />
              ))}

              {/* Slightly brighter label groove at platter edge */}
              <circle r={PLATTER_R - 2} fill="none" stroke="#2a2a2a" strokeWidth="1.5" />

              {/* ── Centre hub ─────────────────────────────────────────────── */}
              <circle r={HUB_R} fill="url(#jw-hub)" stroke="#282828" strokeWidth="1" />
              <circle r={HUB2_R} fill="#0a0a0a" stroke="#2e2e2e" strokeWidth="0.8" />

              {/* Lime green spindle */}
              <circle r={SPINDLE_R} fill="#84cc16" />
              <circle r={SPINDLE_R} fill="none" stroke="#a3e635" strokeWidth="0.6" opacity="0.6" />

              {/* ── 12 o'clock position marker on metallic ring ────────────── */}
              <line
                x1="0" y1={-(RING_INNER + 3)}
                x2="0" y2={-(RING_OUTER - 3)}
                stroke="#84cc16"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.85"
              />
            </svg>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
