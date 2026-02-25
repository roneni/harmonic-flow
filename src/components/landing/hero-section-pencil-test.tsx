"use client";

import Link from "next/link";
import { JogWheel } from "./jog-wheel";
import { ThumbnailMosaic } from "./thumbnail-mosaic";

export function HeroSectionPencilTest() {
    return (
        <section
            style={{ background: "#0a0a0a" }}
            className="relative overflow-hidden px-6 pt-16 pb-[30px] md:pt-20 md:pb-[56px]"
        >
            {/* ORIGINAL: YouTube thumbnail mosaic background */}
            <ThumbnailMosaic />

            <div className="relative mx-auto max-w-7xl">
                <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">

                    {/* ── Left Column: PENCIL'S TYPOGRAPHY ───────────────────── */}
                    <div className="flex flex-col items-center text-center md:items-start md:text-left font-mono">

                        {/* Badge */}
                        <div className="flex items-center gap-2 rounded-full border border-[#2A2A2A] px-3.5 py-[5px] w-fit" style={{ backdropFilter: "blur(10px)", background: "rgba(0,0,0,0.5)" }}>
                            <div className="w-[7px] h-[7px] rounded-full bg-[#84CC16]" />
                            <span className="text-[10px] font-semibold tracking-[2px] text-[#888888]">
                                PRO-AUDIO HARMONIC ENGINE
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 className="mt-[26px] md:mt-[36px] font-black leading-[0.92] text-white tracking-[-1.6px]" style={{ fontSize: "clamp(56px, 8vw, 80px)" }}>
                            HARMONIC<br />PRECISION
                        </h1>

                        {/* Slogan */}
                        <p className="mt-[14px] text-[22px] md:text-[26px] font-semibold tracking-[0.5px] text-[#84cc16]">
                            Tracklist your Playlist
                        </p>

                        {/* Pipeline */}
                        <p
                            className="mt-[10px] text-[11px] md:text-[13px] font-semibold tracking-[2.5px] text-[#E0E0E0] rounded-full px-4 py-1.5 -mx-4"
                            style={{
                                backdropFilter: "blur(12px) saturate(0.5)",
                                WebkitBackdropFilter: "blur(12px) saturate(0.5)",
                                background: "rgba(0, 0, 0, 0.6)",
                                boxShadow: "inset 0 0 0 0.5px rgba(132, 204, 22, 0.08), 0 0 20px rgba(0,0,0,0.5)",
                                textShadow: "0 0 8px rgba(132, 204, 22, 0.25)",
                            }}
                        >
                            UPLOAD &nbsp;&gt;&nbsp; ANALYZE &nbsp;&gt;&nbsp; HARMONIZE
                        </p>

                        {/* Subtitle */}
                        <p
                            className="mt-[25px] text-[14px] leading-[1.7] text-[#E0E0E0] max-w-[440px] rounded-lg px-5 py-4 -mx-5"
                            style={{
                                backdropFilter: "blur(20px) saturate(0.3)",
                                WebkitBackdropFilter: "blur(20px) saturate(0.3)",
                                background: "rgba(10, 10, 10, 0.72)",
                                boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.05), 0 4px 24px rgba(0,0,0,0.4)",
                            }}
                        >
                            Optimize Your DJ Sets with Professional Harmonic Mixing for
                            Rekordbox, Serato, and Traktor.
                        </p>

                        {/* CTA group */}
                        <div className="mt-[30px] flex flex-col items-center md:items-start gap-4">

                            {/* Primary CTA */}
                            <Link
                                href="/optimize"
                                className="flex items-center justify-center w-[190px] h-[46px] rounded border-2 border-[#84cc16] bg-transparent text-white text-[13px] font-bold tracking-[2px] hover:bg-[#84cc16] hover:text-black transition-colors"
                            >
                                TRY IT FREE
                            </Link>

                            {/* Secondary CTA */}
                            <Link
                                href="/#how-it-works"
                                className="text-[13px] text-[#B0B0B0] hover:text-[#84cc16] transition-colors font-medium"
                                style={{
                                    textShadow: "0 1px 2px rgba(0,0,0,1), 0 0 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.6)",
                                }}
                            >
                                See how it works →
                            </Link>
                        </div>
                    </div>

                    {/* ── Right Column: ORIGINAL JOG WHEEL ───────────────────── */}
                    <div className="hidden md:flex items-center justify-center">
                        <JogWheel />
                    </div>

                </div>
            </div>
        </section>
    );
}
