"use client";

import { useEffect, useRef } from "react";

// ─── VU Meter Animation ─────────────────────────────────────────────────────

function useVuMeter(meterRef: React.RefObject<HTMLDivElement | null>, barCount: number, baseLevel: number) {
  useEffect(() => {
    const el = meterRef.current;
    if (!el) return;

    const bars = el.querySelectorAll<HTMLDivElement>("[data-led]");
    if (!bars.length) return;

    let raf: number;
    let t = 0;

    const animate = () => {
      t += 0.04;
      // Organic bounce: base level + sine wave + random jitter
      const level = Math.min(
        barCount,
        Math.max(
          2,
          Math.round(
            baseLevel +
              Math.sin(t * 1.7) * 3 +
              Math.sin(t * 3.1) * 1.5 +
              (Math.random() - 0.5) * 2
          )
        )
      );

      bars.forEach((bar, i) => {
        const index = barCount - 1 - i; // bottom = highest index
        if (index < level) {
          // Lit: brightness falls off toward the top
          const brightness = Math.max(0.3, 1 - (index / barCount) * 0.6);
          bar.style.opacity = String(brightness);
          bar.style.background = "#84CC16";
        } else {
          bar.style.opacity = "0.12";
          bar.style.background = "#84CC16";
        }
      });

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [meterRef, barCount, baseLevel]);
}

// ─── LED Bar ─────────────────────────────────────────────────────────────────

function LedBar() {
  return (
    <div
      data-led
      className="w-full rounded-[1px]"
      style={{
        height: 8,
        background: "#84CC16",
        opacity: 0.12,
      }}
    />
  );
}

// ─── VU Meter Column ─────────────────────────────────────────────────────────

function VuMeterColumn({
  barCount,
  baseLevel,
  width,
}: {
  barCount: number;
  baseLevel: number;
  width: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useVuMeter(ref, barCount, baseLevel);

  return (
    <div
      ref={ref}
      className="flex flex-col gap-[2px] justify-end"
      style={{
        width,
        height: 280,
        padding: 2,
        border: "1px solid #1A1A1A",
      }}
    >
      {Array.from({ length: barCount }, (_, i) => (
        <LedBar key={i} />
      ))}
    </div>
  );
}

// ─── VU Meter Panel (Right Side) ─────────────────────────────────────────────

function VuMeterPanel() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 flex-1 h-full">
      {/* dB label */}
      <span
        className="font-mono text-[9px] text-center"
        style={{ color: "#555555" }}
      >
        dB
      </span>

      {/* Meters + Scale */}
      <div className="flex items-start gap-2">
        {/* Left channel */}
        <VuMeterColumn barCount={25} baseLevel={18} width={18} />

        {/* Right channel */}
        <VuMeterColumn barCount={20} baseLevel={14} width={12} />

        {/* Scale labels */}
        <div
          className="flex flex-col justify-between font-mono text-[9px]"
          style={{ height: 280, color: "#555555" }}
        >
          <span>0</span>
          <span>-20</span>
          <span>-inf</span>
        </div>
      </div>

      {/* Channel labels */}
      <div className="flex items-center justify-center gap-2">
        <span
          className="font-mono text-[9px] text-center"
          style={{ color: "#555555", width: 18 }}
        >
          L
        </span>
        <span
          className="font-mono text-[9px] text-center"
          style={{ color: "#555555", width: 12 }}
        >
          R
        </span>
      </div>

      {/* Signal label */}
      <span
        className="font-mono text-[9px] tracking-[2px]"
        style={{ color: "#555555" }}
      >
        SIGNAL PATH
      </span>
    </div>
  );
}

// ─── Founder Story Section ───────────────────────────────────────────────────

export default function FounderStory() {
  return (
    <section className="relative w-full overflow-hidden" style={{ height: 900 }}>
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/images/dj-setup.jpg')",
        }}
      />

      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,10,0.82) 0%, rgba(10,10,10,0.72) 50%, rgba(10,10,10,0.82) 100%)",
        }}
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: 1, background: "#1A1A1A" }}
      />

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: 1, background: "#1A1A1A" }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center h-full max-w-[1440px] mx-auto px-[100px] py-[80px] gap-[80px]">
        {/* ─── Left Column: Text Content ─── */}
        <div className="flex flex-col justify-center gap-8 flex-1 h-full">
          {/* Kicker badge */}
          <div className="flex items-center gap-2">
            <div
              className="w-[6px] h-[6px] rounded-full"
              style={{ background: "#84CC16" }}
            />
            <span
              className="font-mono text-[10px] font-bold tracking-[2px]"
              style={{ color: "#84CC16" }}
            >
              BUILT IN PSYCHEDELIC UNIVERSE LABS
            </span>
          </div>

          {/* Headline */}
          <h2
            className="font-semibold leading-[1.4] tracking-[-0.5px]"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 28,
              color: "#FFFFFF",
              maxWidth: 620,
            }}
          >
            {
              "「 I'm the guy behind one of the largest Psytrance channels on YouTube. I built this tool for myself. 」"
            }
          </h2>

          {/* Quote body */}
          <p
            className="font-mono text-[13px] font-normal leading-[1.75]"
            style={{ color: "#CCCCCC", maxWidth: 580 }}
          >
            After years of mixing I started asking: how can I simplify this
            process? Organizing a playlist by harmonic key is tedious — it can
            eat up an hour before you even play a single track. So I built
            something that transforms your playlist into a perfectly sequenced
            tracklist automatically, in seconds. After testing it on my own sets
            and seeing it work, I decided to share it with the community.
          </p>

          {/* Divider */}
          <div
            style={{
              width: 60,
              height: 1,
              background: "rgba(132, 204, 22, 0.25)",
            }}
          />

          {/* Credibility badge */}
          <div className="flex items-center gap-3">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: "#84CC16" }}
            />
            <span
              className="font-mono text-[10px] font-semibold tracking-[1.5px]"
              style={{ color: "#84CC16" }}
            >
              RONEN, CREATOR OF HARMONYSET
            </span>
          </div>
        </div>

        {/* ─── Right Column: VU Meter ─── */}
        <div className="hidden md:flex items-center justify-center flex-1 h-full">
          <VuMeterPanel />
        </div>
      </div>
    </section>
  );
}
