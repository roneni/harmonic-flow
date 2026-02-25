"use client";

import { useEffect, useState, useRef, useCallback } from "react";

/* ─── Engine phases with Material Symbols Sharp icon names ────────── */
const ENGINE_PHASES: { label: string; icon: string }[] = [
    { label: "Scanning playlist file...", icon: "search" },
    { label: "Parsing track metadata...", icon: "description" },
    { label: "Extracting BPM values...", icon: "speed" },
    { label: "Mapping musical keys...", icon: "music_note" },
    { label: "Building key graph...", icon: "hub" },
    { label: "Calculating harmonic distances...", icon: "analytics" },
    { label: "Analyzing Circle of Fifths paths...", icon: "donut_large" },
    { label: "Resolving key conflicts...", icon: "sync" },
    { label: "Scoring transition quality...", icon: "grade" },
    { label: "Sequencing transitions...", icon: "route" },
    { label: "Evaluating energy flow...", icon: "trending_up" },
    { label: "Applying energy mode curve...", icon: "tune" },
    { label: "Optimizing playlist order...", icon: "auto_fix_high" },
    { label: "Validating harmonic sequence...", icon: "verified" },
    { label: "Compiling final tracklist...", icon: "playlist_add_check" },
    { label: "Finalizing harmonic sequence...", icon: "check_circle" },
];

const PHASE_DURATION_MS = 1500;
const PARTICLE_COUNT = 10;

/* ─── Timestamp formatter ─────────────────────────────────────────── */
function formatTimestamp(ms: number): string {
    const totalSec = ms / 1000;
    const min = Math.floor(totalSec / 60)
        .toString()
        .padStart(2, "0");
    const sec = (totalSec % 60).toFixed(1).padStart(4, "0");
    return `${min}:${sec}`;
}

/* ─── Main Component ──────────────────────────────────────────────── */
export function ProcessingOverlay() {
    const [phaseIndex, setPhaseIndex] = useState(0);
    const [logLines, setLogLines] = useState<{ label: string; ts: string }[]>([]);
    const [complete, setComplete] = useState(false);
    const [borderFlash, setBorderFlash] = useState(false);

    // Smooth progress via requestAnimationFrame
    const [displayProgress, setDisplayProgress] = useState(0);
    const targetProgressRef = useRef(0);
    const rafRef = useRef<number>(0);
    const startTimeRef = useRef(Date.now());
    const logEndRef = useRef<HTMLDivElement>(null);

    // Smooth progress animation loop
    const animateProgress = useCallback(() => {
        setDisplayProgress((prev) => {
            const target = targetProgressRef.current;
            if (Math.abs(target - prev) < 0.3) return target;
            return prev + (target - prev) * 0.08;
        });
        rafRef.current = requestAnimationFrame(animateProgress);
    }, []);

    useEffect(() => {
        rafRef.current = requestAnimationFrame(animateProgress);
        return () => cancelAnimationFrame(rafRef.current);
    }, [animateProgress]);

    // Phase progression
    useEffect(() => {
        if (complete) return;

        const id = setInterval(() => {
            setPhaseIndex((prev) => {
                if (prev >= ENGINE_PHASES.length - 1) {
                    // All phases done → completion state
                    clearInterval(id);
                    targetProgressRef.current = 100;
                    setComplete(true);
                    setBorderFlash(true);
                    setTimeout(() => setBorderFlash(false), 600);
                    return prev;
                }
                const next = prev + 1;
                // Log the completed phase
                const elapsed = Date.now() - startTimeRef.current;
                setLogLines((lines) => [
                    ...lines,
                    { label: ENGINE_PHASES[prev].label, ts: formatTimestamp(elapsed) },
                ]);
                // Update target progress
                targetProgressRef.current =
                    ((next + 1) / ENGINE_PHASES.length) * 100;
                return next;
            });
        }, PHASE_DURATION_MS);

        // Set initial target
        targetProgressRef.current =
            ((0 + 1) / ENGINE_PHASES.length) * 100;

        return () => clearInterval(id);
    }, [complete]);

    // Auto-scroll terminal log
    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logLines]);

    const currentPhase = ENGINE_PHASES[phaseIndex];

    // SVG progress ring
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset =
        circumference - (displayProgress / 100) * circumference;

    return (
        <div
            className="relative flex flex-col items-center justify-center py-16 px-4 overflow-hidden rounded-lg border transition-all duration-300"
            style={{
                background: "#0A0A0A",
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                borderColor: borderFlash ? "#84CC16" : "#1A1A1A",
                boxShadow: borderFlash
                    ? "0 0 40px rgba(132,204,22,0.25), inset 0 0 40px rgba(132,204,22,0.05)"
                    : "none",
            }}
        >
            {/* Material Symbols Sharp font */}
            <link
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@24,400,0,0"
                rel="stylesheet"
            />

            {/* ── Floating particles ──────────────────────────────── */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: `${2 + Math.random() * 1.5}px`,
                            height: `${2 + Math.random() * 1.5}px`,
                            background: "#84CC16",
                            opacity: 0.15 + Math.random() * 0.2,
                            left: `${15 + Math.random() * 70}%`,
                            bottom: "-8px",
                            animationName: "particleFloat",
                            animationDuration: `${5 + Math.random() * 4}s`,
                            animationTimingFunction: "linear",
                            animationIterationCount: "infinite",
                            animationDelay: `${i * 0.6}s`,
                        }}
                    />
                ))}
            </div>

            {/* ── Progress ring with pulsing glow ─────────────────── */}
            <div className="relative mb-10">
                {/* Pulsing glow ring */}
                <div
                    className="absolute rounded-full"
                    style={{
                        inset: "-12px",
                        animationName: "pulseGlow",
                        animationDuration: "1.5s",
                        animationTimingFunction: "ease-in-out",
                        animationIterationCount: "infinite",
                    }}
                />

                <svg width="128" height="128" className="transform -rotate-90">
                    {/* Background ring */}
                    <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        fill="none"
                        stroke="#1A1A1A"
                        strokeWidth="4"
                    />
                    {/* Progress arc */}
                    <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        fill="none"
                        stroke="#84CC16"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        style={{
                            transition: "stroke-dashoffset 200ms ease-out",
                            filter: "drop-shadow(0 0 8px rgba(132,204,22,0.5))",
                        }}
                    />
                </svg>

                {/* Spinning conic sweep */}
                <div
                    className="absolute inset-0 rounded-full"
                    style={{
                        animationName: "spin",
                        animationDuration: "3s",
                        animationTimingFunction: "linear",
                        animationIterationCount: "infinite",
                        background:
                            "conic-gradient(from 0deg, transparent 0%, transparent 75%, rgba(132,204,22,0.06) 100%)",
                    }}
                />

                {/* Percentage text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {complete ? (
                        <span
                            className="material-symbols-sharp"
                            style={{
                                fontSize: "36px",
                                color: "#84CC16",
                                filter: "drop-shadow(0 0 10px rgba(132,204,22,0.5))",
                            }}
                        >
                            check_circle
                        </span>
                    ) : (
                        <span
                            className="text-[24px] font-bold tabular-nums"
                            style={{ color: "#84CC16" }}
                        >
                            {Math.round(displayProgress)}%
                        </span>
                    )}
                </div>
            </div>

            {/* ── Current phase with icon ─────────────────────────── */}
            {complete ? (
                <p
                    className="text-[14px] font-bold tracking-[4px] uppercase text-center mb-8"
                    style={{
                        color: "#84CC16",
                        textShadow: "0 0 16px rgba(132,204,22,0.5)",
                        animationName: "fadeIn",
                        animationDuration: "0.4s",
                        animationTimingFunction: "ease-out",
                        animationFillMode: "both",
                    }}
                >
                    SEQUENCE LOCKED
                </p>
            ) : (
                <div className="flex items-center gap-2.5 mb-8">
                    <span
                        className="material-symbols-sharp"
                        style={{
                            fontSize: "18px",
                            color: "#84CC16",
                            opacity: 0.8,
                        }}
                    >
                        {currentPhase.icon}
                    </span>
                    <p
                        className="text-[12px] font-semibold tracking-[2px] uppercase text-center"
                        style={{
                            color: "#84CC16",
                            textShadow: "0 0 10px rgba(132,204,22,0.3)",
                        }}
                    >
                        {currentPhase.label}
                    </p>
                </div>
            )}

            {/* ── Terminal log ─────────────────────────────────────── */}
            <div
                className="w-full max-w-[480px] rounded border px-4 py-3 overflow-y-auto"
                style={{
                    borderColor: "#1E1E1E",
                    background: "#0F0F0F",
                    maxHeight: "200px",
                    minHeight: "140px",
                }}
            >
                {logLines.map((entry, i) => (
                    <div
                        key={i}
                        className="text-[11px] leading-[1.9] truncate"
                        style={{ color: "rgba(132,204,22,0.38)" }}
                    >
                        <span style={{ color: "rgba(132,204,22,0.22)" }}>
                            [{entry.ts}]
                        </span>{" "}
                        <span style={{ color: "rgba(132,204,22,0.28)" }}>
                            ✓
                        </span>{" "}
                        {entry.label}
                    </div>
                ))}
                {/* Active line (unless complete) */}
                {!complete && (
                    <div
                        className="text-[11px] leading-[1.9] truncate"
                        style={{ color: "#84CC16" }}
                    >
                        <span style={{ opacity: 0.4 }}>&gt;</span>{" "}
                        {currentPhase.label}
                        <span
                            className="inline-block w-[6px] h-[13px] ml-1 align-middle"
                            style={{
                                background: "#84CC16",
                                animationName: "blink",
                                animationDuration: "0.8s",
                                animationTimingFunction: "step-end",
                                animationIterationCount: "infinite",
                            }}
                        />
                    </div>
                )}
                {complete && (
                    <div
                        className="text-[11px] leading-[1.9] mt-1 pt-1"
                        style={{
                            color: "#84CC16",
                            borderTop: "1px solid #1E1E1E",
                        }}
                    >
                        ✓ All phases complete — sequence locked.
                    </div>
                )}
                <div ref={logEndRef} />
            </div>

            {/* ── Keyframes ───────────────────────────────────────── */}
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes blink {
                    50% { opacity: 0; }
                }
                @keyframes pulseGlow {
                    0%, 100% { box-shadow: 0 0 12px rgba(132,204,22,0.15); }
                    50% { box-shadow: 0 0 28px rgba(132,204,22,0.35); }
                }
                @keyframes particleFloat {
                    0% { transform: translateY(0) scale(1); opacity: 0; }
                    10% { opacity: 0.3; }
                    90% { opacity: 0.1; }
                    100% { transform: translateY(-500px) scale(0.3); opacity: 0; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
}
