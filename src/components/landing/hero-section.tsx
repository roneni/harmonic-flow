"use client";

import Link from "next/link";
import Image from "next/image";
import { JogWheel } from "./jog-wheel";

// ---------------------------------------------------------------------------
// Video thumbnails — same IDs used in youtube-strip, reused here as mosaic bg
// ---------------------------------------------------------------------------
const MOSAIC_IDS = [
  "rrdQIQXQF8I",
  "sn0pgbuKfUY",
  "PRdcytOMvn4",
  "PZe5PqUDjBU",
  "2rYGCA7bdFU",
  "hdNoYygg2aI",
  "K_66Gnv7wKY",
  "UwHkETjnSq0",
];

// 5 columns × 3 rows = 15 cells; repeat the 8 videos to fill
const GRID_IDS = [...MOSAIC_IDS, ...MOSAIC_IDS.slice(0, 7)]; // 15 total

// Per-cell rotation offsets (degrees) for the scattered-mosaic feel
const ROTATIONS = [
  1.2, -0.8, 1.6, -1.3, 0.5,
  -1.7, 0.9, 1.4, -0.6, 1.1,
  0.7, -1.5, 1.0, -0.9, 1.8,
];

export function HeroSection() {
  return (
    <section
      style={{ background: "#0a0a0a" }}
      className="relative overflow-hidden px-6 pt-16 pb-20 md:pt-20 md:pb-28"
    >
      {/* ── Mosaic background: video thumbnails scattered across full area ── */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        {/* Thumbnail grid — oversized and very slightly tilted */}
        <div
          style={{
            position: "absolute",
            inset: "-10%",
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gridTemplateRows: "repeat(3, 1fr)",
            gap: "10px",
            transform: "rotate(-1.5deg) scale(1.04)",
          }}
        >
          {GRID_IDS.map((id, i) => (
            <div
              key={`mosaic-${id}-${i}`}
              style={{
                position: "relative",
                borderRadius: 6,
                overflow: "hidden",
                transform: `rotate(${ROTATIONS[i]}deg)`,
                opacity: 0.38,
              }}
            >
              <Image
                src={`https://img.youtube.com/vi/${id}/mqdefault.jpg`}
                alt=""
                fill
                sizes="22vw"
                className="object-cover"
                unoptimized
              />
            </div>
          ))}
        </div>

        {/* Edge fade — top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "45%",
            background:
              "linear-gradient(to bottom, #0a0a0a 0%, rgba(10,10,10,0.7) 50%, transparent 100%)",
          }}
        />

        {/* Edge fade — bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "45%",
            background:
              "linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,0.7) 50%, transparent 100%)",
          }}
        />

        {/* Edge fade — left (stronger: hero text lives here) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: "42%",
            background:
              "linear-gradient(to right, #0a0a0a 0%, rgba(10,10,10,0.85) 50%, transparent 100%)",
          }}
        />

        {/* Edge fade — right */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: "30%",
            background:
              "linear-gradient(to left, #0a0a0a 0%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">

          {/* ── Left: copy + CTA ────────────────────────────────────────── */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">

            {/* Headline */}
            <h1
              className="font-black leading-none tracking-tighter uppercase text-white"
              style={{
                fontSize: "clamp(56px, 8vw, 96px)",
                lineHeight: 0.93,
                letterSpacing: "-0.02em",
              }}
            >
              HARMONIC
              <br />
              PRECISION
            </h1>

            {/* Subtitle */}
            <p
              className="mt-6 max-w-md text-base md:text-lg leading-relaxed"
              style={{ color: "#888888" }}
            >
              Optimize Your DJ Sets with Professional Harmonic Mixing for
              Rekordbox, Serato, and Traktor.
            </p>

            {/* CTA group */}
            <div className="mt-10 flex flex-col items-center md:items-start gap-4">

              {/* Primary CTA — lime green, 3D matte finish */}
              <Link
                href="/optimize"
                className="group relative inline-block text-sm font-bold tracking-widest uppercase select-none"
                style={{
                  color: "#0a0a0a",
                  background: "#84cc16",
                  padding: "14px 40px",
                  borderRadius: 4,
                  letterSpacing: "0.12em",
                  boxShadow: "0 4px 0 #3f6212, 0 8px 24px rgba(132, 204, 22, 0.18)",
                  transition: "transform 80ms ease, box-shadow 80ms ease",
                }}
                onMouseDown={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(3px)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 1px 0 #3f6212, 0 4px 12px rgba(132, 204, 22, 0.12)";
                }}
                onMouseUp={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 4px 0 #3f6212, 0 8px 24px rgba(132, 204, 22, 0.18)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 4px 0 #3f6212, 0 8px 24px rgba(132, 204, 22, 0.18)";
                }}
              >
                TRY IT FREE
              </Link>

              {/* Secondary CTA — plain text link */}
              <Link
                href="/#how-it-works"
                className="text-sm transition-colors"
                style={{ color: "#888888" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#888888";
                }}
              >
                See how it works →
              </Link>
            </div>

            {/* Trust line */}
            <p
              className="mt-8 text-xs"
              style={{ color: "#555555" }}
            >
              No account required &nbsp;·&nbsp; Works with Rekordbox, Traktor &amp; Serato
            </p>
          </div>

          {/* ── Right: Jog wheel (desktop only) ─────────────────────────── */}
          <div className="hidden md:flex items-center justify-center">
            <JogWheel />
          </div>

        </div>
      </div>
    </section>
  );
}
