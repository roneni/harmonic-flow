"use client";

/* ─── Track data ────────────────────────────────────────────────── */
const originalTracks = [
    { num: 1, artist: "Ectima", title: "Python", bpm: "142.00", key: "Fm" },
    { num: 2, artist: "Suntree", title: "To the Unknown", bpm: "137.00", key: "Dm" },
    { num: 3, artist: "Lifeforms", title: "Agitation", bpm: "143.00", key: "C" },
    { num: 4, artist: "Waveform", title: "Energy of Sound", bpm: "140.00", key: "F#m" },
];

const harmonicTracks = [
    { num: 1, artist: "Reverse", title: "Dark Silence", bpm: "137.00", key: "Ebm" },
    { num: 2, artist: "Zyce & Waveform", title: "Multidimensional Experience", bpm: "138.01", key: "Ebm" },
    { num: 3, artist: "Xerox", title: "Inspace", bpm: "145.00", key: "Ebm" },
    { num: 4, artist: "Mind Sense & Serenity Flux", title: "Sierra", bpm: "142.00", key: "Bbm" },
];

/* ─── Clash indicator between original tracks ───────────────────── */
function ClashIndicator() {
    return (
        <div className="flex items-center justify-center gap-2 py-0.5 opacity-60">
            <div className="h-px w-6 bg-[#EF4444]/30" />
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            <span className="text-[8px] font-mono tracking-[1px] text-[#EF4444]/50 font-medium">CLASH</span>
            <div className="h-px w-6 bg-[#EF4444]/30" />
        </div>
    );
}

/* ─── Harmony indicator between harmonic tracks ─────────────────── */
function HarmonyIndicator() {
    return (
        <div className="flex items-center justify-center gap-2 py-0.5 opacity-60">
            <div className="h-px w-6 bg-[#84CC16]/30" />
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#84CC16" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
                <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="text-[8px] font-mono tracking-[1px] text-[#84CC16]/50 font-medium">MATCH</span>
            <div className="h-px w-6 bg-[#84CC16]/30" />
        </div>
    );
}

/* ─── Track row component ───────────────────────────────────────── */
function TrackRow({
    num,
    artist,
    title,
    bpm,
    keyVal,
    variant,
}: {
    num: number;
    artist: string;
    title: string;
    bpm: string;
    keyVal: string;
    variant: "original" | "harmonic";
}) {
    const keyColor = variant === "original" ? "#EF4444" : "#84CC16";
    const keyGlow = variant === "original"
        ? "0 0 8px rgba(239,68,68,0.2)"
        : "0 0 8px rgba(132,204,22,0.2)";

    return (
        <div
            className="group flex items-center gap-4 px-4 py-3 rounded-md border border-[#1E1E1E] transition-all duration-200 hover:border-[#2A2A2A]"
            style={{
                background: "rgba(15, 15, 15, 0.6)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
            }}
        >
            {/* Track number */}
            <span className="text-[11px] font-mono font-bold text-[#444] w-[18px] shrink-0 tabular-nums">
                {String(num).padStart(2, "0")}
            </span>

            {/* Divider dot */}
            <div className="w-[3px] h-[3px] rounded-full bg-[#2A2A2A] shrink-0" />

            {/* Artist & Title */}
            <div className="flex-1 min-w-0">
                <p className="text-[13px] text-white font-medium truncate" style={{ fontFamily: "Geist, sans-serif" }}>
                    {artist} <span className="text-[#666]">—</span> {title}
                </p>
            </div>

            {/* BPM */}
            <span className="text-[11px] font-mono text-[#888] tracking-[0.5px] shrink-0 tabular-nums">
                {bpm} <span className="text-[#555] text-[9px]">BPM</span>
            </span>

            {/* Key badge */}
            <div
                className="flex items-center justify-center min-w-[44px] px-2 py-0.5 rounded border shrink-0"
                style={{
                    borderColor: `${keyColor}33`,
                    background: `${keyColor}0A`,
                    boxShadow: keyGlow,
                }}
            >
                <span
                    className="text-[11px] font-mono font-bold tracking-[0.5px]"
                    style={{ color: keyColor }}
                >
                    {keyVal}
                </span>
            </div>
        </div>
    );
}

/* ─── Column header ─────────────────────────────────────────────── */
function ColumnHeader({ label, variant }: { label: string; variant: "original" | "harmonic" }) {
    const dotColor = variant === "original" ? "#EF4444" : "#84CC16";
    const dotGlow = variant === "original"
        ? "0 0 6px rgba(239,68,68,0.3)"
        : "0 0 6px rgba(132,204,22,0.3)";

    return (
        <div
            className="flex items-center gap-2.5 rounded-full px-4 py-1.5 mb-3 w-fit border border-[#1E1E1E]"
            style={{
                background: "rgba(15, 15, 15, 0.7)",
                backdropFilter: "blur(10px)",
            }}
        >
            <div
                className="w-[6px] h-[6px] rounded-full"
                style={{ backgroundColor: dotColor, boxShadow: dotGlow }}
            />
            <span className="text-[10px] font-mono font-semibold tracking-[2px] text-[#999]">
                {label}
            </span>
        </div>
    );
}

/* ─── Center gutter with routing paths (SVG) ───────────────────── */
function RoutingPaths() {
    return (
        <div className="hidden md:flex items-center justify-center h-full w-full">
            <svg viewBox="0 0 60 320" className="w-[60px] h-[280px]" fill="none" role="img" aria-label="Routing diagram showing track reordering from original to harmonically optimized order">
                <defs>
                    {/* Green glow filter */}
                    <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    {/* Red dim filter */}
                    <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="1.5" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Routing lines — chaotic input → organized output */}
                {/* Track 1 left → Track 3 right (crosses) */}
                <path d="M0,40 C20,40 40,180 60,180" stroke="#84CC16" strokeWidth="1.2" opacity="0.4" filter="url(#glow-green)" />
                {/* Track 2 left → Track 1 right */}
                <path d="M0,110 C25,110 35,40 60,40" stroke="#84CC16" strokeWidth="1.2" opacity="0.4" filter="url(#glow-green)" />
                {/* Track 3 left → Track 4 right */}
                <path d="M0,180 C20,180 40,250 60,250" stroke="#84CC16" strokeWidth="1.2" opacity="0.35" filter="url(#glow-green)" />
                {/* Track 4 left → Track 2 right */}
                <path d="M0,250 C25,250 35,110 60,110" stroke="#84CC16" strokeWidth="1.2" opacity="0.4" filter="url(#glow-green)" />

                {/* Junction nodes where lines cross */}
                <circle cx="30" cy="110" r="3" fill="#84CC16" opacity="0.5" filter="url(#glow-green)" />
                <circle cx="30" cy="175" r="2.5" fill="#84CC16" opacity="0.4" filter="url(#glow-green)" />
                <circle cx="25" cy="145" r="2" fill="#84CC16" opacity="0.3" />

                {/* Input dots (left edge) */}
                <circle cx="0" cy="40" r="2.5" fill="#EF4444" opacity="0.6" filter="url(#glow-red)" />
                <circle cx="0" cy="110" r="2.5" fill="#EF4444" opacity="0.6" filter="url(#glow-red)" />
                <circle cx="0" cy="180" r="2.5" fill="#EF4444" opacity="0.6" filter="url(#glow-red)" />
                <circle cx="0" cy="250" r="2.5" fill="#EF4444" opacity="0.6" filter="url(#glow-red)" />

                {/* Output dots (right edge) */}
                <circle cx="60" cy="40" r="2.5" fill="#84CC16" opacity="0.7" filter="url(#glow-green)" />
                <circle cx="60" cy="110" r="2.5" fill="#84CC16" opacity="0.7" filter="url(#glow-green)" />
                <circle cx="60" cy="180" r="2.5" fill="#84CC16" opacity="0.7" filter="url(#glow-green)" />
                <circle cx="60" cy="250" r="2.5" fill="#84CC16" opacity="0.7" filter="url(#glow-green)" />

                {/* Subtle center line */}
                <line x1="30" y1="10" x2="30" y2="310" stroke="#1A1A1A" strokeWidth="0.5" />
            </svg>
        </div>
    );
}

/* ─── Main Tracklist Comparison Component ───────────────────────── */
export function TracklistComparison() {
    return (
        <section className="relative bg-[#0A0A0A] font-mono">
            {/* Top divider */}
            <div className="w-full h-px bg-[#1A1A1A]" />

            <div className="relative mx-auto max-w-7xl px-6 py-12 md:py-16">

                {/* Section header */}
                <div className="text-center mb-10">
                    <span className="text-[10px] font-mono font-semibold tracking-[3px] text-[#84CC16] mb-2 block">
                        HARMONIC ANALYSIS
                    </span>
                    <h2 className="text-[28px] md:text-[32px] font-bold text-white mb-3" style={{ fontFamily: "Geist, sans-serif" }}>
                        See The Difference
                    </h2>
                    <p className="text-[13px] font-mono text-[#777] tracking-[0.5px]">
                        Your playlist, reordered for flawless harmonic transitions.
                    </p>
                </div>

                {/* Comparison grid */}
                <div className="grid md:grid-cols-[1fr_60px_1fr] gap-0 md:gap-0 items-start max-w-[1100px] mx-auto">

                    {/* ── Left Column: Original Playlist ────────────────── */}
                    <div>
                        <ColumnHeader label="ORIGINAL PLAYLIST" variant="original" />
                        <div className="flex flex-col gap-0">
                            {originalTracks.map((track, i) => (
                                <div key={track.num}>
                                    <TrackRow
                                        num={track.num}
                                        artist={track.artist}
                                        title={track.title}
                                        bpm={track.bpm}
                                        keyVal={track.key}
                                        variant="original"
                                    />
                                    {i < originalTracks.length - 1 && <ClashIndicator />}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Center Gutter: Routing Paths ──────────────────── */}
                    <RoutingPaths />

                    {/* ── Right Column: Harmonic Output ─────────────────── */}
                    <div>
                        <ColumnHeader label="HARMONIC OUTPUT" variant="harmonic" />
                        <div className="flex flex-col gap-0">
                            {harmonicTracks.map((track, i) => (
                                <div key={track.num}>
                                    <TrackRow
                                        num={track.num}
                                        artist={track.artist}
                                        title={track.title}
                                        bpm={track.bpm}
                                        keyVal={track.key}
                                        variant="harmonic"
                                    />
                                    {i < harmonicTracks.length - 1 && <HarmonyIndicator />}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
