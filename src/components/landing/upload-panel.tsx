"use client";

import { useCallback, useState, useEffect, useRef } from "react";

/* ─── Processing engine phases (matching real algorithm steps) ──── */
const ENGINE_PHASES = [
    "Scanning playlist file...",
    "Parsing track metadata...",
    "Extracting BPM values...",
    "Mapping musical keys...",
    "Building key graph...",
    "Calculating harmonic distances...",
    "Analyzing Circle of Fifths paths...",
    "Sequencing transitions...",
    "Evaluating energy flow...",
    "Tuning BPM gradients...",
    "Resolving key conflicts...",
    "Harmonizing adjacent pairs...",
    "Orchestrating set order...",
    "Calibrating transition scores...",
    "Optimizing playlist...",
    "Finalizing harmonic sequence...",
];

/* ─── Decorative hex bolt (pro-audio rack hardware) ─────────────── */
function ScrewBolt({ className }: { className?: string }) {
    return (
        <div className={`absolute w-[11px] h-[11px] ${className}`}>
            <div
                className="w-full h-full rounded-full"
                style={{
                    background: "radial-gradient(circle at 35% 35%, #6A6A6A 0%, #4A4A4A 40%, #2A2A2A 100%)",
                    boxShadow: "inset 0 1px 2px rgba(255,255,255,0.15), inset 0 -1px 1px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.6)",
                }}
            >
                <div className="absolute inset-0 flex items-center justify-center">
                    <div
                        className="w-[5px] h-[5px] rounded-[1px]"
                        style={{
                            background: "radial-gradient(circle, #1A1A1A 0%, #2A2A2A 100%)",
                            boxShadow: "inset 0 0.5px 1px rgba(0,0,0,0.8)",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

/* ─── Signal LED indicator with pulse animation ────────────────── */
function SignalLED({ active = true, pulse = false, fast = false }: { active?: boolean; pulse?: boolean; fast?: boolean }) {
    return (
        <div className="flex items-center gap-1.5">
            <div
                className={`w-[6px] h-[6px] rounded-full ${active ? "bg-[#84CC16]" : "bg-[#333]"}`}
                style={active ? {
                    boxShadow: "0 0 6px #84CC16, 0 0 12px rgba(132,204,22,0.3)",
                    ...(pulse ? {
                        animation: fast
                            ? "signal-pulse-fast 0.6s ease-in-out infinite"
                            : "signal-pulse 2.4s ease-in-out infinite",
                    } : {}),
                } : {}}
            />
            {pulse && (
                <style>{`
                    @keyframes signal-pulse {
                        0%, 100% { opacity: 0.4; box-shadow: 0 0 3px rgba(132,204,22,0.2); }
                        15% { opacity: 1; box-shadow: 0 0 8px #84CC16, 0 0 16px rgba(132,204,22,0.4); }
                        30% { opacity: 0.6; box-shadow: 0 0 4px rgba(132,204,22,0.2); }
                        45% { opacity: 1; box-shadow: 0 0 10px #84CC16, 0 0 20px rgba(132,204,22,0.5); }
                        65% { opacity: 0.85; box-shadow: 0 0 6px #84CC16, 0 0 12px rgba(132,204,22,0.3); }
                        80% { opacity: 0.5; box-shadow: 0 0 3px rgba(132,204,22,0.15); }
                    }
                    @keyframes signal-pulse-fast {
                        0%, 100% { opacity: 0.5; box-shadow: 0 0 4px rgba(132,204,22,0.3); }
                        50% { opacity: 1; box-shadow: 0 0 10px #84CC16, 0 0 20px rgba(132,204,22,0.5); }
                    }
                `}</style>
            )}
        </div>
    );
}

/* ─── Animated VU Meter (active during processing) ──────────────── */
function VUMeter({ animated = false }: { animated?: boolean }) {
    const baseColors = [
        "#84CC16", "#84CC16", "#84CC16", "#84CC16", "#84CC16",
        "#84CC16", "#84CC16", "#A3E635", "#A3E635", "#EAB308",
        "#EAB308", "#F97316", "#EF4444", "#444", "#444", "#444",
    ];
    return (
        <div className="flex items-end gap-[2px] h-[14px]">
            {baseColors.map((color, i) => (
                <div
                    key={i}
                    className="w-[3px] rounded-[0.5px]"
                    style={{
                        height: `${6 + Math.min(i, 10) * 0.8}px`,
                        backgroundColor: color,
                        opacity: i < 13 ? 0.9 : 0.25,
                        ...(animated && i < 13 ? {
                            animation: `vu-bounce 0.8s ease-in-out infinite`,
                            animationDelay: `${i * 0.05}s`,
                        } : {}),
                    }}
                />
            ))}
            {animated && (
                <style>{`
                    @keyframes vu-bounce {
                        0%, 100% { transform: scaleY(1); }
                        50% { transform: scaleY(1.4); }
                    }
                `}</style>
            )}
        </div>
    );
}

/* ─── Pipeline Step Indicator (now with dynamic active state) ───── */
function PipelineSteps({ activeStep = 0 }: { activeStep?: number }) {
    const steps = [
        { label: "UPLOAD" },
        { label: "ANALYZE" },
        { label: "HARMONIZE" },
    ];

    return (
        <div className="flex items-center gap-3 font-mono">
            {steps.map((step, i) => {
                const isActive = i <= activeStep;
                const isCurrent = i === activeStep;
                return (
                    <div key={step.label} className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div
                                className={`w-[22px] h-[22px] rounded-full flex items-center justify-center text-[9px] font-bold border transition-all duration-500 ${
                                    isActive
                                        ? "border-[#84CC16] text-[#84CC16]"
                                        : "border-[#555] text-[#999]"
                                }`}
                                style={isCurrent ? {
                                    boxShadow: "0 0 8px rgba(132,204,22,0.3), inset 0 0 6px rgba(132,204,22,0.1)",
                                    animation: "step-glow 1.5s ease-in-out infinite",
                                } : isActive ? {
                                    boxShadow: "0 0 6px rgba(132,204,22,0.15)",
                                } : {}}
                            >
                                {isActive && i < activeStep ? (
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#84CC16" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                ) : (
                                    i + 1
                                )}
                            </div>
                            <span
                                className={`text-[11px] tracking-[2px] font-semibold transition-all duration-500 ${
                                    isActive ? "text-[#84CC16]" : "text-[#999]"
                                }`}
                                style={isActive ? {
                                    textShadow: "0 0 10px rgba(132,204,22,0.3)",
                                } : {}}
                            >
                                {step.label}
                            </span>
                        </div>
                        {i < steps.length - 1 && (
                            <div className="flex items-center gap-1">
                                <div
                                    className={`w-6 h-[1px] transition-all duration-500 ${isActive && i < activeStep ? "bg-[#84CC16]" : "bg-[#444]"}`}
                                    style={isActive && i < activeStep ? { opacity: 0.6 } : {}}
                                />
                                <span className="text-[#666] text-[10px]">›</span>
                            </div>
                        )}
                    </div>
                );
            })}
            <style>{`
                @keyframes step-glow {
                    0%, 100% { box-shadow: 0 0 8px rgba(132,204,22,0.2), inset 0 0 6px rgba(132,204,22,0.08); }
                    50% { box-shadow: 0 0 14px rgba(132,204,22,0.4), inset 0 0 8px rgba(132,204,22,0.15); }
                }
            `}</style>
        </div>
    );
}

/* ─── Processing Terminal Display ───────────────────────────────── */
function ProcessingTerminal({
    phase,
    progress,
    logLines,
}: {
    phase: string;
    progress: number;
    logLines: string[];
}) {
    return (
        <div className="flex flex-col items-center justify-center py-6 md:py-8 gap-5 w-full">
            {/* Spinning processor ring */}
            <div className="relative w-[56px] h-[56px]">
                <svg viewBox="0 0 56 56" className="w-full h-full animate-spin" style={{ animationDuration: "3s" }}>
                    <circle cx="28" cy="28" r="24" fill="none" stroke="#1A1A1A" strokeWidth="2" />
                    <circle
                        cx="28" cy="28" r="24" fill="none"
                        stroke="#84CC16" strokeWidth="2"
                        strokeDasharray={`${progress * 1.508} 150.8`}
                        strokeLinecap="round"
                        style={{ filter: "drop-shadow(0 0 4px rgba(132,204,22,0.4))" }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[12px] font-mono font-bold text-[#84CC16]" style={{ textShadow: "0 0 8px rgba(132,204,22,0.3)" }}>
                        {Math.round(progress)}%
                    </span>
                </div>
            </div>

            {/* Current phase — the fast-cycling text */}
            <div className="text-center">
                <p
                    className="text-[15px] md:text-[17px] font-bold tracking-[2px] text-[#84CC16] mb-1"
                    style={{
                        textShadow: "0 0 16px rgba(132,204,22,0.3)",
                        animation: "phase-flicker 0.15s ease-in-out infinite",
                    }}
                >
                    {phase.toUpperCase().replace("...", "")}
                </p>
                <div className="flex items-center justify-center gap-1 mt-1">
                    <div className="w-1 h-1 rounded-full bg-[#84CC16] animate-pulse" />
                    <div className="w-1 h-1 rounded-full bg-[#84CC16] animate-pulse" style={{ animationDelay: "0.2s" }} />
                    <div className="w-1 h-1 rounded-full bg-[#84CC16] animate-pulse" style={{ animationDelay: "0.4s" }} />
                </div>
            </div>

            {/* Terminal log — scrolling past phases */}
            <div
                className="w-full max-w-[360px] rounded border border-[#1A1A1A] px-3 py-2 overflow-hidden"
                style={{
                    background: "rgba(8,8,8,0.8)",
                    maxHeight: "72px",
                }}
            >
                {logLines.slice(-4).map((line, i) => (
                    <p
                        key={`${line}-${i}`}
                        className="text-[10px] font-mono leading-[18px] truncate"
                        style={{
                            color: i === logLines.length - 1 ? "#84CC16" : "#444",
                            opacity: i === logLines.length - 1 ? 1 : 0.6 + i * 0.1,
                        }}
                    >
                        <span className="text-[#333] mr-1">›</span> {line}
                    </p>
                ))}
            </div>

            <style>{`
                @keyframes phase-flicker {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.85; }
                }
            `}</style>
        </div>
    );
}

/* ─── Idle Drop Zone Content ────────────────────────────────────── */
function IdleDropZone({ isDragOver }: { isDragOver: boolean }) {
    return (
        <>
            {/* Upload icon with green LED ring glow */}
            <div className="relative mb-4">
                <div
                    className="absolute -inset-3 rounded-full"
                    style={{ background: "radial-gradient(circle, rgba(132,204,22,0.08) 0%, transparent 70%)" }}
                />
                <div
                    className="relative w-[44px] h-[44px] rounded-full flex items-center justify-center border border-[#2A2A2A]"
                    style={{
                        background: "radial-gradient(circle at 40% 40%, #1A1A1A 0%, #111 100%)",
                        boxShadow: "0 0 12px rgba(132,204,22,0.1), inset 0 1px 2px rgba(255,255,255,0.04)",
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#84CC16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                </div>
            </div>

            <p
                className="text-[16px] md:text-[18px] font-bold tracking-[3px] text-white mb-2"
                style={{ textShadow: "0 0 20px rgba(132,204,22,0.12)" }}
            >
                PATCH IN YOUR PLAYLIST.
            </p>

            <p className="text-[11px] md:text-[12px] tracking-[1px] text-[#999] font-medium">
                Drop .txt or .xml &nbsp;•&nbsp; Rekordbox, Serato, Traktor
            </p>

            <button
                className="mt-5 px-5 py-2 rounded border border-[#2A2A2A] text-[11px] tracking-[1.5px] font-semibold text-[#888] hover:border-[#84CC16] hover:text-[#84CC16] transition-all duration-200 bg-transparent"
                style={{ backdropFilter: "blur(8px)" }}
            >
                BROWSE FILES
            </button>
        </>
    );
}

/* ─── Complete State ────────────────────────────────────────────── */
function CompleteState() {
    return (
        <div className="flex flex-col items-center justify-center py-6 md:py-8 gap-3">
            <div
                className="w-[48px] h-[48px] rounded-full flex items-center justify-center border border-[#84CC16]"
                style={{
                    boxShadow: "0 0 16px rgba(132,204,22,0.3), inset 0 0 8px rgba(132,204,22,0.1)",
                }}
            >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#84CC16" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            </div>
            <p className="text-[16px] font-bold tracking-[2px] text-[#84CC16]" style={{ textShadow: "0 0 12px rgba(132,204,22,0.3)" }}>
                SEQUENCE COMPLETE
            </p>
            <p className="text-[11px] tracking-[1px] text-[#666] font-medium">
                26 tracks harmonized &nbsp;•&nbsp; Score: 85/100
            </p>
        </div>
    );
}

/* ─── Main Upload Panel Component ───────────────────────────────── */
export function UploadPanel() {
    const [state, setState] = useState<"idle" | "processing" | "complete">("idle");
    const [isDragOver, setIsDragOver] = useState(false);
    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [logLines, setLogLines] = useState<string[]>([]);
    const [pipelineStep, setPipelineStep] = useState(0);
    const processingRef = useRef<NodeJS.Timeout | null>(null);

    const startProcessing = useCallback(() => {
        setState("processing");
        setCurrentPhaseIndex(0);
        setProgress(0);
        setLogLines([]);
        setPipelineStep(1); // Activate ANALYZE

        let phaseIdx = 0;

        processingRef.current = setInterval(() => {
            if (phaseIdx >= ENGINE_PHASES.length) {
                if (processingRef.current) clearInterval(processingRef.current);
                setPipelineStep(2); // Activate HARMONIZE
                setTimeout(() => setState("complete"), 400);
                return;
            }

            setCurrentPhaseIndex(phaseIdx);
            setProgress((phaseIdx / ENGINE_PHASES.length) * 100);
            setLogLines(prev => [...prev, ENGINE_PHASES[phaseIdx]]);

            // Switch pipeline to HARMONIZE at ~60%
            if (phaseIdx >= ENGINE_PHASES.length * 0.6) {
                setPipelineStep(2);
            }

            phaseIdx++;
        }, 280); // Fast cycling — ~280ms per phase
    }, []);

    useEffect(() => {
        return () => {
            if (processingRef.current) clearInterval(processingRef.current);
        };
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        startProcessing();
    }, [startProcessing]);

    const isProcessing = state === "processing";
    const isComplete = state === "complete";

    return (
        <section className="relative bg-[#0A0A0A] font-mono">
            <div className="w-full h-px bg-[#1A1A1A]" />

            <div className="relative mx-auto max-w-7xl px-6 py-8 md:py-10">

                <div className="flex justify-center mb-6">
                    <PipelineSteps activeStep={pipelineStep} />
                </div>

                <div className="relative mx-auto max-w-[680px]">
                    <div
                        className={`relative rounded-lg border transition-all duration-500 ${
                            isProcessing
                                ? "border-[#84CC1644]"
                                : isComplete
                                    ? "border-[#84CC16]"
                                    : isDragOver
                                        ? "border-[#84CC16]"
                                        : "border-[#1E1E1E]"
                        }`}
                        style={{
                            background: "linear-gradient(180deg, rgba(20,20,20,0.9) 0%, rgba(12,12,12,0.95) 100%)",
                            boxShadow: isProcessing
                                ? "0 0 40px rgba(132,204,22,0.1), inset 0 1px 0 rgba(255,255,255,0.03)"
                                : isComplete
                                    ? "0 0 30px rgba(132,204,22,0.15), inset 0 1px 0 rgba(255,255,255,0.03)"
                                    : isDragOver
                                        ? "0 0 30px rgba(132,204,22,0.15), inset 0 1px 0 rgba(255,255,255,0.03)"
                                        : "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)",
                        }}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <ScrewBolt className="top-3 left-3" />
                        <ScrewBolt className="top-3 right-3" />
                        <ScrewBolt className="bottom-3 left-3" />
                        <ScrewBolt className="bottom-3 right-3" />

                        <div className="absolute top-3.5 left-8 flex items-center gap-2">
                            <span className="text-[8px] tracking-[1.5px] text-[#777] font-semibold">
                                STUDIO INPUT UPLOAD
                            </span>
                        </div>
                        <div className="absolute top-3.5 right-8 flex items-center gap-2">
                            <span className="text-[8px] tracking-[1px] text-[#777] font-semibold">
                                SIGNAL
                            </span>
                            <SignalLED active pulse fast={isProcessing} />
                        </div>

                        {/* Inner drop zone — content switches between states */}
                        <div className="mx-6 my-10 md:mx-10">
                            <div
                                className={`relative flex flex-col items-center justify-center rounded border border-dashed transition-all duration-500 ${
                                    isProcessing
                                        ? "border-[#84CC1633] bg-[rgba(132,204,22,0.02)]"
                                        : isComplete
                                            ? "border-[#84CC1666] bg-[rgba(132,204,22,0.03)]"
                                            : isDragOver
                                                ? "border-[#84CC16] bg-[rgba(132,204,22,0.03)]"
                                                : "border-[#2A2A2A] bg-transparent"
                                }`}
                                style={{ backdropFilter: "blur(8px)", minHeight: "200px" }}
                            >
                                {state === "idle" && <IdleDropZone isDragOver={isDragOver} />}
                                {state === "processing" && (
                                    <ProcessingTerminal
                                        phase={ENGINE_PHASES[currentPhaseIndex] || ""}
                                        progress={progress}
                                        logLines={logLines}
                                    />
                                )}
                                {state === "complete" && <CompleteState />}
                            </div>
                        </div>

                        <div className="absolute bottom-3.5 left-8 flex items-center gap-2">
                            <VUMeter animated={isProcessing} />
                        </div>
                        <div className="absolute bottom-3.5 right-8 flex items-center gap-2">
                            <span className="text-[8px] tracking-[1px] text-[#777] font-semibold">
                                PROCESSING
                            </span>
                            <SignalLED active={isProcessing || isComplete} pulse={isProcessing} fast={isProcessing} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
