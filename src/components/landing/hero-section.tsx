"use client";

import Link from "next/link";
import { JogWheel } from "./jog-wheel";
import { ThumbnailMosaic } from "./thumbnail-mosaic";

export function HeroSection() {
  return (
    <section
      style={{ background: "#0a0a0a" }}
      className="relative overflow-hidden px-6 pt-16 pb-20 md:pt-20 md:pb-28"
    >
      {/* YouTube thumbnail mosaic background */}
      <ThumbnailMosaic />

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

              {/* Primary CTA — lime green outline, transparent background */}
              <Link
                href="/optimize"
                className="group relative inline-block text-sm font-bold tracking-widest uppercase select-none"
                style={{
                  color: "#ffffff",
                  background: "transparent",
                  border: "2px solid #84cc16",
                  padding: "12px 38px", // adjusted slightly to account for the 2px border
                  borderRadius: 4,
                  letterSpacing: "0.12em",
                  transition: "all 150ms ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(132, 204, 22, 0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.transform = "";
                }}
                onMouseDown={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "scale(0.98)";
                }}
                onMouseUp={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "";
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
