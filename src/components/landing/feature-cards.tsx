"use client";

/* ─── Helper: round to 2 decimal places (prevents SSR/client hydration mismatch) */
const r2 = (n: number) => Math.round(n * 100) / 100;
const toRad = (deg: number) => (deg * Math.PI) / 180;

/* ─── Circle of Fifths Key Data ────────────────────────────────── */
const MAJOR_KEYS = [
    "C", "G", "D", "A", "E", "B", "F#", "Db", "Ab", "Eb", "Bb", "F",
];
const MINOR_KEYS = [
    "Am", "Em", "Bm", "F#m", "C#m", "G#m", "D#m", "Bbm", "Fm", "Cm", "Gm", "Dm",
];
const HIGHLIGHTED_KEYS = new Set(["Am", "Em", "Bm", "F#m"]);
const HIGHLIGHTED_MAJOR = new Set(["C", "G", "D", "A"]);

/* ─── Pre-compute all Circle of Fifths positions (avoids trig during render) ── */
const COF_CX = 150;
const COF_CY = 145;
const COF_OUTER_R = 110;
const COF_INNER_R = 75;

function cofPos(index: number, radius: number) {
    const angle = toRad(index * 30 - 90);
    return { x: r2(COF_CX + radius * Math.cos(angle)), y: r2(COF_CY + radius * Math.sin(angle)) };
}

const MAJOR_LABEL_POSITIONS = MAJOR_KEYS.map((_, i) => cofPos(i, COF_OUTER_R + 18));
const MINOR_LABEL_POSITIONS = MINOR_KEYS.map((_, i) => cofPos(i, COF_INNER_R - 18));
const INNER_RING_POSITIONS = Array.from({ length: 12 }, (_, i) => cofPos(i, COF_INNER_R));

/* Arc paths (pre-computed strings) */
const ARC_START = toRad(0 * 30 - 90 - 15);
const ARC_END = toRad(3 * 30 - 90 + 15);

const INNER_ARC_PATH = `M ${r2(COF_CX + COF_INNER_R * Math.cos(ARC_START))} ${r2(COF_CY + COF_INNER_R * Math.sin(ARC_START))} A ${COF_INNER_R} ${COF_INNER_R} 0 0 1 ${r2(COF_CX + COF_INNER_R * Math.cos(ARC_END))} ${r2(COF_CY + COF_INNER_R * Math.sin(ARC_END))}`;
const OUTER_ARC_PATH = `M ${r2(COF_CX + COF_OUTER_R * Math.cos(ARC_START))} ${r2(COF_CY + COF_OUTER_R * Math.sin(ARC_START))} A ${COF_OUTER_R} ${COF_OUTER_R} 0 0 1 ${r2(COF_CX + COF_OUTER_R * Math.cos(ARC_END))} ${r2(COF_CY + COF_OUTER_R * Math.sin(ARC_END))}`;

const SECTOR_PATHS = [0, 1, 2, 3].map((i) => {
    const a1 = toRad(i * 30 - 90 - 15);
    const a2 = toRad(i * 30 - 90 + 15);
    return [
        `M ${r2(COF_CX + COF_INNER_R * Math.cos(a1))} ${r2(COF_CY + COF_INNER_R * Math.sin(a1))}`,
        `A ${COF_INNER_R} ${COF_INNER_R} 0 0 1 ${r2(COF_CX + COF_INNER_R * Math.cos(a2))} ${r2(COF_CY + COF_INNER_R * Math.sin(a2))}`,
        `L ${r2(COF_CX + COF_OUTER_R * Math.cos(a2))} ${r2(COF_CY + COF_OUTER_R * Math.sin(a2))}`,
        `A ${COF_OUTER_R} ${COF_OUTER_R} 0 0 0 ${r2(COF_CX + COF_OUTER_R * Math.cos(a1))} ${r2(COF_CY + COF_OUTER_R * Math.sin(a1))}`,
        "Z",
    ].join(" ");
});

/* Pre-compute rotary knob SVG values */
function computeKnob(value: number) {
    const r = 22;
    const cx = 28;
    const cy = 28;
    const startAngle = 135;
    const endAngle = 135 + value * 270;
    const startRad = toRad(startAngle);
    const endRad = toRad(endAngle);
    return {
        startX: r2(cx + r * Math.cos(startRad)),
        startY: r2(cy + r * Math.sin(startRad)),
        endX: r2(cx + r * Math.cos(endRad)),
        endY: r2(cy + r * Math.sin(endRad)),
        largeArc: endAngle - startAngle > 180 ? 1 : 0,
        r,
        cx,
        cy,
    };
}

const KNOB_BPM = computeKnob(0.7);
const KNOB_ENERGY = computeKnob(0.55);

/* ─── Decorative hex bolt (pro-audio rack hardware) ─────────────── */
function ScrewBolt({ className }: { className?: string }) {
    return (
        <div className={`absolute w-[9px] h-[9px] ${className}`}>
            <div
                className="w-full h-full rounded-full"
                style={{
                    background:
                        "radial-gradient(circle at 40% 35%, #555555, #2A2A2A)",
                    border: "0.5px solid #1A1A1A",
                }}
            />
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[5px] h-[0.5px]"
                style={{ background: "#444444" }}
            />
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[0.5px] h-[5px]"
                style={{ background: "#444444" }}
            />
        </div>
    );
}

/* ─── Card Header ───────────────────────────────────────────────── */
function CardHeader({
    icon,
    title,
    badge,
}: {
    icon: React.ReactNode;
    title: string;
    badge?: string;
}) {
    return (
        <div
            className="flex items-center gap-2 px-4 h-10 shrink-0"
            style={{
                background: "#0A0A0A",
                borderBottom: "1px solid #1A1A1A",
            }}
        >
            {icon}
            <span
                className="font-mono text-xs font-bold tracking-wider"
                style={{ color: "#84CC16", letterSpacing: "1px" }}
            >
                {title}
            </span>
            <div className="flex-1" />
            {badge && (
                <span
                    className="font-mono text-[9px] font-semibold px-2 py-0.5 rounded-sm"
                    style={{
                        background: "#84CC1615",
                        color: "#84CC1680",
                    }}
                >
                    {badge}
                </span>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   CARD 1: KEY DETECTION — Circle of Fifths
   ═══════════════════════════════════════════════════════════════════ */
function KeyDetectionCard() {
    return (
        <div
            className="flex flex-col rounded-[10px] overflow-hidden relative"
            style={{
                background: "#0F0F0F",
                border: "1px solid #1A1A1A",
            }}
        >
            <ScrewBolt className="top-2 left-2" />
            <ScrewBolt className="top-2 right-2" />
            <ScrewBolt className="bottom-2 left-2" />
            <ScrewBolt className="bottom-2 right-2" />

            <CardHeader
                icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#84CC16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18V5l12-2v13" />
                        <circle cx="6" cy="18" r="3" />
                        <circle cx="18" cy="16" r="3" />
                    </svg>
                }
                title="KEY DETECTION"
            />

            {/* Circle of Fifths SVG */}
            <div className="flex-1 flex items-center justify-center px-4 py-3">
                <svg viewBox="0 0 300 290" className="w-full max-w-[300px]" role="img" aria-label="Circle of Fifths key detection visualization">
                    {/* Outer circle ring */}
                    <circle cx={COF_CX} cy={COF_CY} r={COF_OUTER_R} fill="none" stroke="#1A1A1A" strokeWidth="1" />
                    {/* Inner circle ring */}
                    <circle cx={COF_CX} cy={COF_CY} r={COF_INNER_R} fill="none" stroke="#1A1A1A" strokeWidth="1" />
                    {/* Center glow */}
                    <circle cx={COF_CX} cy={COF_CY} r="30" fill="url(#cofGlow)" />
                    <defs>
                        <radialGradient id="cofGlow">
                            <stop offset="0%" stopColor="#84CC1618" />
                            <stop offset="100%" stopColor="#84CC1600" />
                        </radialGradient>
                    </defs>

                    {/* Highlighted arcs */}
                    <path d={OUTER_ARC_PATH} fill="none" stroke="#84CC16" strokeWidth="2" opacity="0.5" />
                    <path d={INNER_ARC_PATH} fill="none" stroke="#84CC16" strokeWidth="2" opacity="0.7" />

                    {/* Highlighted fill sectors */}
                    {SECTOR_PATHS.map((d, i) => (
                        <path
                            key={i}
                            d={d}
                            fill="#84CC1612"
                            stroke="#84CC1630"
                            strokeWidth="0.5"
                        />
                    ))}

                    {/* Connecting lines between highlighted keys */}
                    {[0, 1, 2].map((i) => (
                        <line
                            key={`conn-${i}`}
                            x1={INNER_RING_POSITIONS[i].x}
                            y1={INNER_RING_POSITIONS[i].y}
                            x2={INNER_RING_POSITIONS[i + 1].x}
                            y2={INNER_RING_POSITIONS[i + 1].y}
                            stroke="#84CC16"
                            strokeWidth="1"
                            opacity="0.5"
                        />
                    ))}

                    {/* Major key labels (outer) */}
                    {MAJOR_KEYS.map((key, i) => {
                        const pos = MAJOR_LABEL_POSITIONS[i];
                        const hl = HIGHLIGHTED_MAJOR.has(key);
                        return (
                            <text
                                key={key}
                                x={pos.x}
                                y={pos.y}
                                textAnchor="middle"
                                dominantBaseline="central"
                                fill={hl ? "#84CC16" : "#444444"}
                                fontSize="10"
                                fontFamily="JetBrains Mono, monospace"
                                fontWeight={hl ? "700" : "400"}
                            >
                                {key}
                            </text>
                        );
                    })}

                    {/* Minor key labels (inner) */}
                    {MINOR_KEYS.map((key, i) => {
                        const pos = MINOR_LABEL_POSITIONS[i];
                        const hl = HIGHLIGHTED_KEYS.has(key);
                        return (
                            <text
                                key={key}
                                x={pos.x}
                                y={pos.y}
                                textAnchor="middle"
                                dominantBaseline="central"
                                fill={hl ? "#84CC16" : "#333333"}
                                fontSize="9"
                                fontFamily="JetBrains Mono, monospace"
                                fontWeight={hl ? "700" : "400"}
                            >
                                {key}
                            </text>
                        );
                    })}
                </svg>
            </div>

            {/* Detected key display */}
            <div className="flex flex-col items-center gap-1 pb-2">
                <span
                    className="font-mono text-[9px] font-semibold tracking-widest"
                    style={{ color: "#555555" }}
                >
                    DETECTED KEY
                </span>
                <span
                    className="font-mono text-base font-bold"
                    style={{ color: "#FFFFFF" }}
                >
                    Am (Camelot: 8A)
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                    <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "#84CC16" }}
                    />
                    <span
                        className="font-mono text-[9px] font-semibold tracking-wider"
                        style={{ color: "#84CC1680" }}
                    >
                        ACTIVE
                    </span>
                </div>
            </div>

            {/* Bottom stats */}
            <div
                className="flex items-center justify-between px-4 py-2.5 font-mono text-[9px] shrink-0"
                style={{
                    borderTop: "1px solid #1A1A1A",
                    color: "#444444",
                }}
            >
                <span>12 keys mapped</span>
                <span>94% harmonic</span>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   CARD 2: ENERGY ROUTING — Waveform Bars + Knobs
   ═══════════════════════════════════════════════════════════════════ */
const ENERGY_MODES = [
    {
        label: "RAMP\nUP",
        bars: [0.2, 0.3, 0.4, 0.55, 0.65, 0.75, 0.85, 1.0],
    },
    {
        label: "RAMP\nDOWN",
        bars: [1.0, 0.85, 0.75, 0.65, 0.55, 0.4, 0.3, 0.2],
    },
    {
        label: "WAVE",
        bars: [0.3, 0.7, 0.4, 0.9, 0.35, 0.8, 0.3, 0.65],
    },
];

function RotaryKnob({
    label,
    knob,
}: {
    label: string;
    knob: ReturnType<typeof computeKnob>;
}) {
    return (
        <div className="flex flex-col items-center gap-2">
            <svg width="56" height="56" viewBox="0 0 56 56" role="img" aria-label={`${label} rotary control`}>
                <circle
                    cx={knob.cx}
                    cy={knob.cy}
                    r={knob.r}
                    fill="#111111"
                    stroke="#1A1A1A"
                    strokeWidth="2"
                />
                <path
                    d={`M ${knob.startX} ${knob.startY} A ${knob.r} ${knob.r} 0 ${knob.largeArc} 1 ${knob.endX} ${knob.endY}`}
                    fill="none"
                    stroke="#84CC16"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                />
                <circle
                    cx={knob.endX}
                    cy={knob.endY}
                    r="3"
                    fill="#84CC16"
                />
            </svg>
            <span
                className="font-mono text-[9px] font-semibold tracking-wider"
                style={{ color: "#555555" }}
            >
                {label}
            </span>
        </div>
    );
}

function EnergyRoutingCard() {
    return (
        <div
            className="flex flex-col rounded-[10px] overflow-hidden relative"
            style={{
                background: "#0F0F0F",
                border: "1px solid #1A1A1A",
            }}
        >
            <ScrewBolt className="top-2 left-2" />
            <ScrewBolt className="top-2 right-2" />
            <ScrewBolt className="bottom-2 left-2" />
            <ScrewBolt className="bottom-2 right-2" />

            <CardHeader
                icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#84CC16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="4" y="4" width="6" height="16" rx="1" />
                        <rect x="14" y="8" width="6" height="12" rx="1" />
                    </svg>
                }
                title="ENERGY ROUTING"
            />

            {/* Energy mode rows */}
            <div className="flex-1 flex flex-col px-4 py-3 gap-0">
                {ENERGY_MODES.map((mode, mi) => (
                    <div key={mi}>
                        <div className="flex items-center gap-3 py-2.5">
                            <span
                                className="font-mono text-[9px] font-semibold w-12 shrink-0 whitespace-pre-line leading-tight"
                                style={{
                                    color: mi === 0 ? "#84CC16" : "#555555",
                                    letterSpacing: "0.5px",
                                }}
                            >
                                {mode.label}
                            </span>
                            <div className="flex items-end gap-1.5 flex-1 h-10">
                                {mode.bars.map((h, bi) => (
                                    <div
                                        key={bi}
                                        className="flex-1 rounded-sm"
                                        style={{
                                            height: `${h * 100}%`,
                                            background:
                                                mi === 0
                                                    ? `rgba(132, 204, 22, ${r2(0.3 + h * 0.7)})`
                                                    : `rgba(132, 204, 22, ${r2(0.15 + h * 0.35)})`,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                        {mi < ENERGY_MODES.length - 1 && (
                            <div
                                className="w-full h-px"
                                style={{ background: "#1A1A1A" }}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Knobs section */}
            <div
                className="flex items-center justify-center gap-16 py-4"
                style={{ borderTop: "1px solid #1A1A1A" }}
            >
                <RotaryKnob label="BPM RANGE" knob={KNOB_BPM} />
                <RotaryKnob label="ENERGY CURVE" knob={KNOB_ENERGY} />
            </div>

            {/* Bottom stats */}
            <div
                className="flex items-center justify-between px-4 py-2.5 font-mono text-[9px] shrink-0"
                style={{
                    borderTop: "1px solid #1A1A1A",
                    color: "#444444",
                }}
            >
                <span>
                    <span style={{ color: "#84CC16" }}>*</span> Ramp Up
                    selected
                </span>
                <span>128-134 BPM</span>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   CARD 3: XML PARSER — Terminal Aesthetic
   ═══════════════════════════════════════════════════════════════════ */
const XML_LINES: { num: number; code: string; color: string }[] = [
    { num: 1, code: '<?xml version="1.0" encoding="UTF-8"?>', color: "#666666" },
    { num: 2, code: "<DJ_PLAYLISTS>", color: "#84CC16" },
    { num: 3, code: '  <COLLECTION Entries="847">', color: "#84CC16" },
    { num: 4, code: '    <TRACK TrackID="1042"', color: "#FFFFFF" },
    { num: 5, code: '      Name="Vini Vici - The Tribe"', color: "#B8B9B6" },
    { num: 6, code: '      Tonality="Am" BPM="138.00"', color: "#84CC16" },
    { num: 7, code: '      Genre="Psytrance" Rating="5"', color: "#B8B9B6" },
    { num: 8, code: '      TotalTime="432" />', color: "#666666" },
    { num: 9, code: '    <TRACK TrackID="1043"', color: "#FFFFFF" },
    { num: 10, code: '      Name="Astrix - Deep Jungle Walk"', color: "#B8B9B6" },
    { num: 11, code: '      Tonality="Em" BPM="140.00"', color: "#84CC16" },
    { num: 12, code: '      Genre="Psytrance" Rating="5"', color: "#B8B9B6" },
];

const FORMAT_BADGES = [
    { label: "XML", active: true },
    { label: "CSV", active: false },
    { label: "TXT", active: false },
    { label: "NML", active: false },
];

function XmlParserCard() {
    return (
        <div
            className="flex flex-col rounded-[10px] overflow-hidden relative"
            style={{
                background: "#0F0F0F",
                border: "1px solid #1A1A1A",
            }}
        >
            <CardHeader
                icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#84CC16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="4 17 10 11 4 5" />
                        <line x1="12" y1="19" x2="20" y2="19" />
                    </svg>
                }
                title="XML PARSER"
                badge="v2.1"
            />

            {/* Terminal body */}
            <div
                className="flex-1 flex flex-col gap-0.5 px-4 py-3 overflow-hidden"
                style={{ background: "#080808" }}
                role="img"
                aria-label="Rekordbox XML parsing example showing track data extraction"
            >
                {XML_LINES.map((line) => (
                    <div key={line.num} className="flex items-center">
                        <span
                            className="font-mono text-[10px] w-7 text-right mr-2 shrink-0 select-none"
                            style={{ color: "#333333" }}
                        >
                            {line.num}
                        </span>
                        <span
                            className="font-mono text-[10px] whitespace-pre"
                            style={{ color: line.color }}
                        >
                            {line.code}
                        </span>
                    </div>
                ))}
                {/* Cursor line */}
                <div className="flex items-center">
                    <span
                        className="font-mono text-[10px] w-7 text-right mr-2 shrink-0 select-none"
                        style={{ color: "#333333" }}
                    >
                        13
                    </span>
                    <div
                        className="w-[7px] h-[13px] rounded-[1px] animate-pulse"
                        style={{ background: "#84CC16" }}
                    />
                </div>
                <div className="flex-1" />
            </div>

            {/* Status bar */}
            <div
                className="flex flex-col gap-2.5 px-4 py-3 shrink-0"
                style={{
                    background: "#0A0A0A",
                    borderTop: "1px solid #1A1A1A",
                }}
            >
                {/* Parse status */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: "#84CC16" }}
                        />
                        <span
                            className="font-mono text-[9px] font-semibold tracking-wider"
                            style={{ color: "#84CC1690" }}
                        >
                            PARSING: 847 TRACKS FOUND
                        </span>
                    </div>
                    <span
                        className="font-mono text-[9px]"
                        style={{ color: "#555555" }}
                    >
                        2.4s
                    </span>
                </div>

                {/* Format badges */}
                <div className="flex items-center gap-2">
                    <span
                        className="font-mono text-[9px] font-semibold tracking-wider"
                        style={{ color: "#333333" }}
                    >
                        SUPPORTED:
                    </span>
                    {FORMAT_BADGES.map((fmt) => (
                        <span
                            key={fmt.label}
                            className="font-mono text-[9px] font-semibold px-2 py-0.5 rounded-sm"
                            style={{
                                background: fmt.active
                                    ? "#84CC1620"
                                    : "#84CC1610",
                                color: fmt.active
                                    ? "#84CC16"
                                    : "#84CC1670",
                                fontWeight: fmt.active ? 700 : 600,
                            }}
                        >
                            {fmt.label}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN EXPORT: Feature Cards Section
   ═══════════════════════════════════════════════════════════════════ */
export default function FeatureCards() {
    return (
        <section
            className="w-full py-16 px-4"
            style={{ background: "#0A0A0A" }}
        >
            <div className="max-w-6xl mx-auto">
                {/* Section header */}
                <div className="flex items-center justify-between mb-8">
                    <span
                        className="font-mono text-[11px] font-semibold tracking-widest"
                        style={{ color: "#444444" }}
                    >
                        ALGORITHM CAPABILITIES
                    </span>
                    <div
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded"
                        style={{
                            background: "#84CC1610",
                            border: "1px solid #84CC1630",
                        }}
                    >
                        <div
                            className="w-[5px] h-[5px] rounded-full"
                            style={{ background: "#84CC16" }}
                        />
                        <span
                            className="font-mono text-[9px] font-semibold tracking-wider"
                            style={{ color: "#84CC1690" }}
                        >
                            3 MODULES
                        </span>
                    </div>
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <KeyDetectionCard />
                    <EnergyRoutingCard />
                    <XmlParserCard />
                </div>
            </div>
        </section>
    );
}
