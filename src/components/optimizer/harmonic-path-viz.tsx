"use client";

import { CAMELOT_TO_KEY } from "@/lib/algorithm";

/**
 * Custom SVG circle-of-fifths visualization.
 * Outer ring: 12 major keys (B side).
 * Inner ring: 12 relative minor keys (A side).
 * Animated path line in cyan with glow.
 * Uses standard musical notation (Am, C, F#) — never "Camelot" branding.
 */

interface HarmonicPathVizProps {
  path: string[];
}

// Circle of fifths ordering (Camelot numbers 1-12)
// Position 0 = top, going clockwise
const POSITIONS = [
  { num: 1, angle: 0 },
  { num: 2, angle: 30 },
  { num: 3, angle: 60 },
  { num: 4, angle: 90 },
  { num: 5, angle: 120 },
  { num: 6, angle: 150 },
  { num: 7, angle: 180 },
  { num: 8, angle: 210 },
  { num: 9, angle: 240 },
  { num: 10, angle: 270 },
  { num: 11, angle: 300 },
  { num: 12, angle: 330 },
];

const CX = 200;
const CY = 200;
const OUTER_R = 160;
const INNER_R = 110;
const DOT_R_OUTER = 22;
const DOT_R_INNER = 18;

function polarToCart(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function getKeyPosition(camelotKey: string): { x: number; y: number } | null {
  const letter = camelotKey.slice(-1);
  const num = parseInt(camelotKey.slice(0, -1), 10);
  const pos = POSITIONS.find((p) => p.num === num);
  if (!pos) return null;

  const r = letter === "B" ? OUTER_R : INNER_R;
  return polarToCart(CX, CY, r, pos.angle);
}

export function HarmonicPathViz({ path }: HarmonicPathVizProps) {
  const pathSet = new Set(path);

  // Build path line coordinates
  const pathCoords = path
    .map((key) => getKeyPosition(key))
    .filter((p): p is { x: number; y: number } => p !== null);

  const pathD =
    pathCoords.length > 1
      ? `M ${pathCoords.map((p) => `${p.x},${p.y}`).join(" L ")}`
      : "";

  return (
    <div className="flex justify-center">
      <svg viewBox="0 0 400 400" className="h-[360px] w-[360px]">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background circles */}
        <circle
          cx={CX}
          cy={CY}
          r={OUTER_R}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-text-secondary/10"
        />
        <circle
          cx={CX}
          cy={CY}
          r={INNER_R}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-text-secondary/10"
        />

        {/* Path line with glow */}
        {pathD && (
          <>
            <path
              d={pathD}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.3"
              filter="url(#glow)"
            />
            <path
              d={pathD}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.8"
            />
          </>
        )}

        {/* Outer ring: Major keys (B side) */}
        {POSITIONS.map((pos) => {
          const camelotKey = `${pos.num}B`;
          const { x, y } = polarToCart(CX, CY, OUTER_R, pos.angle);
          const displayKey = CAMELOT_TO_KEY[camelotKey] || camelotKey;
          const isActive = pathSet.has(camelotKey);

          return (
            <g key={camelotKey}>
              <circle
                cx={x}
                cy={y}
                r={DOT_R_OUTER}
                fill={isActive ? "var(--color-primary)" : "var(--color-surface)"}
                stroke={
                  isActive
                    ? "var(--color-primary)"
                    : "var(--color-text-secondary)"
                }
                strokeWidth={isActive ? 2 : 1}
                opacity={isActive ? 1 : 0.3}
              />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-[10px] font-medium"
                fill={
                  isActive
                    ? "var(--color-text-primary)"
                    : "var(--color-text-secondary)"
                }
                opacity={isActive ? 1 : 0.4}
              >
                {displayKey}
              </text>
            </g>
          );
        })}

        {/* Inner ring: Minor keys (A side) */}
        {POSITIONS.map((pos) => {
          const camelotKey = `${pos.num}A`;
          const { x, y } = polarToCart(CX, CY, INNER_R, pos.angle);
          const displayKey = CAMELOT_TO_KEY[camelotKey] || camelotKey;
          const isActive = pathSet.has(camelotKey);

          return (
            <g key={camelotKey}>
              <circle
                cx={x}
                cy={y}
                r={DOT_R_INNER}
                fill={isActive ? "var(--color-accent)" : "var(--color-surface)"}
                stroke={
                  isActive
                    ? "var(--color-accent)"
                    : "var(--color-text-secondary)"
                }
                strokeWidth={isActive ? 2 : 1}
                opacity={isActive ? 1 : 0.3}
              />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-[9px] font-medium"
                fill={
                  isActive
                    ? "var(--color-text-primary)"
                    : "var(--color-text-secondary)"
                }
                opacity={isActive ? 1 : 0.4}
              >
                {displayKey}
              </text>
            </g>
          );
        })}

        {/* Path direction arrows */}
        {pathCoords.length > 1 && (
          <>
            {/* Start indicator */}
            <circle
              cx={pathCoords[0].x}
              cy={pathCoords[0].y}
              r={4}
              fill="var(--color-success)"
            />
            {/* End indicator */}
            <circle
              cx={pathCoords[pathCoords.length - 1].x}
              cy={pathCoords[pathCoords.length - 1].y}
              r={4}
              fill="var(--color-clash)"
            />
          </>
        )}

        {/* Legend */}
        <g transform="translate(10, 370)">
          <text
            className="text-[9px]"
            fill="var(--color-text-secondary)"
            opacity="0.5"
          >
            Outer: Major | Inner: Minor
          </text>
        </g>
      </svg>
    </div>
  );
}
