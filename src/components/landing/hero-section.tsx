"use client";

import Link from "next/link";
import { JogWheel } from "./jog-wheel";

export function HeroSection() {
  return (
    <section
      style={{ background: "#0a0a0a" }}
      className="relative overflow-hidden px-6 pt-16 pb-20 md:pt-20 md:pb-28"
    >
      {/* Subtle ambient glow behind the jog wheel */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div
          style={{
            position: "absolute",
            right: "10%",
            top: "20%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(132,204,22,0.06) 0%, transparent 70%)",
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
                  // Matte 3-D depth: darker lime bottom edge + subtle shadow
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
