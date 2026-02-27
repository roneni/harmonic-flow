"use client";

/* ─── Software compatibility data ──────────────────────────────── */
const DJ_SOFTWARE = [
    {
        logo: "/logos/rekordbox.svg",
        alt: "Rekordbox",
        height: 28,
        badge: "v6.x / v7.x VERIFIED",
    },
    {
        logo: "/logos/serato.svg",
        alt: "Serato",
        height: 28,
        badge: "DJ PRO / DJ LITE VERIFIED",
    },
    {
        logo: "/logos/traktor.svg",
        alt: "Traktor",
        height: 25,
        badge: "PRO 3 / PRO 4 VERIFIED",
    },
];

const STATUS_PANELS = [
    { label: "XML PARSER", status: "OK" },
    { label: "CSV EXPORT", status: "OK" },
    { label: "TXT IMPORT", status: "OK" },
];

/* ─── Glowing status panel ─────────────────────────────────────── */
function StatusPanel({ label, status }: { label: string; status: string }) {
    return (
        <div
            className="flex items-center gap-1.5 px-3.5 py-2 rounded font-mono text-[11px]"
            style={{
                background: "#111111",
                border: "1px solid #2A2A2A",
            }}
        >
            <span style={{ color: "#555555" }}>[</span>
            <span style={{ color: "#999999", fontWeight: 500 }}>{label}:</span>
            <span
                style={{
                    color: "#84CC16",
                    fontWeight: 700,
                    textShadow: "0 0 8px rgba(132, 204, 22, 0.6), 0 0 20px rgba(132, 204, 22, 0.25)",
                    animationName: "ok-glow",
                    animationDuration: "2.4s",
                    animationTimingFunction: "ease-in-out",
                    animationIterationCount: "infinite",
                }}
            >
                {status}
            </span>
            <span style={{ color: "#555555" }}>]</span>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN EXPORT: Universal Integration Block
   ═══════════════════════════════════════════════════════════════════ */
export default function UniversalIntegration() {
    return (
        <section
            className="w-full py-14 px-4"
            style={{ background: "#0A0A0A" }}
        >
            <style>{`
                @keyframes ok-glow {
                    0%, 100% {
                        opacity: 0.75;
                        text-shadow: 0 0 4px rgba(132, 204, 22, 0.25);
                    }
                    50% {
                        opacity: 1;
                        text-shadow: 0 0 12px rgba(132, 204, 22, 0.7), 0 0 28px rgba(132, 204, 22, 0.35);
                    }
                }
            `}</style>

            <div className="max-w-5xl mx-auto flex flex-col items-center gap-10">
                {/* Section title */}
                <span
                    className="font-mono text-xs font-semibold"
                    style={{ color: "#888888", letterSpacing: "3px" }}
                >
                    COMPATIBLE WITH
                </span>

                {/* Software logos — real SVGs from /public/logos/ */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-14 sm:gap-20 md:gap-28">
                    {DJ_SOFTWARE.map((sw) => (
                        <div
                            key={sw.alt}
                            className="flex flex-col items-center gap-3 group"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={sw.logo}
                                alt={sw.alt}
                                style={{
                                    height: `${sw.height}px`,
                                    width: "auto",
                                    filter: "brightness(0) invert(1)",
                                    opacity: 0.85,
                                    transition: "opacity 200ms ease",
                                }}
                                className="group-hover:!opacity-100"
                                draggable={false}
                            />
                            <span
                                className="font-mono text-[9px] font-semibold"
                                style={{
                                    color: "#84CC16",
                                    opacity: 0.55,
                                    letterSpacing: "1.5px",
                                }}
                            >
                                {sw.badge}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Import → HarmonySet → Export flow */}
                <div className="flex items-center gap-3 font-mono">
                    <span
                        className="text-[10px] font-semibold"
                        style={{ color: "#666666", letterSpacing: "1px" }}
                    >
                        .xml IN
                    </span>
                    <div
                        className="w-12 md:w-16 h-px"
                        style={{ background: "#2A2A2A" }}
                    />
                    <span
                        className="text-[8px]"
                        style={{ color: "rgba(132, 204, 22, 0.5)" }}
                    >
                        ►
                    </span>
                    <div
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded"
                        style={{
                            background: "rgba(132, 204, 22, 0.05)",
                            border: "1px solid rgba(132, 204, 22, 0.2)",
                        }}
                    >
                        <div
                            className="w-[5px] h-[5px] rounded-full"
                            style={{
                                background: "#84CC16",
                                boxShadow: "0 0 6px rgba(132, 204, 22, 0.4)",
                            }}
                        />
                        <span
                            className="text-[10px] font-bold"
                            style={{
                                color: "#84CC16",
                                letterSpacing: "2px",
                            }}
                        >
                            HARMONYSET
                        </span>
                    </div>
                    <span
                        className="text-[8px]"
                        style={{ color: "rgba(132, 204, 22, 0.5)" }}
                    >
                        ►
                    </span>
                    <div
                        className="w-12 md:w-16 h-px"
                        style={{ background: "#2A2A2A" }}
                    />
                    <span
                        className="text-[10px] font-semibold"
                        style={{ color: "#666666", letterSpacing: "1px" }}
                    >
                        .xml OUT
                    </span>
                </div>

                {/* Thin divider */}
                <div
                    className="w-48 h-px"
                    style={{ background: "#2A2A2A" }}
                />

                {/* Status panels */}
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    {STATUS_PANELS.map((panel) => (
                        <StatusPanel
                            key={panel.label}
                            label={panel.label}
                            status={panel.status}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
