"use client";

import Image from "next/image";

// ---------------------------------------------------------------------------
// Psychedelic Universe video IDs — same set used in YouTubeStrip
// Using mqdefault (320×180) which is reliably available for all videos
// ---------------------------------------------------------------------------
const VIDEO_IDS = [
    "rrdQIQXQF8I",
    "sn0pgbuKfUY",
    "PRdcytOMvn4",
    "PZe5PqUDjBU",
    "2rYGCA7bdFU",
    "hdNoYygg2aI",
    "K_66Gnv7wKY",
    "UwHkETjnSq0",
    "c2ExXW1SpGM",
    "JfLMADyiYVE",
    "0az2NYzGGbw",
    "WQtqZOBfNd0",
    "jqQwdApbg2c",
    "ufJoZwwjbtI",
    "wqzvRgXVunc",
    "wHagWQ6XT0U",
    "_sBMbvooqI0",
    "OltmDX-g3Fs",
    "kM7IP1sjwkY",
    "mSG6HjGu528",
    "CeTlphXFTmA",
    "NL2QaSmia1c",
    "jW46QoPu720",
    "XOLAgFQwHu4",
];

// ---------------------------------------------------------------------------
// We tile the mosaic by repeating the IDs to fill a 6-column × 4-row grid.
// Each thumbnail keeps its 16:9 aspect ratio.
// ---------------------------------------------------------------------------
const COLS = 6;
const ROWS = 4;
const TOTAL = COLS * ROWS; // 24 tiles

const tiles = Array.from({ length: TOTAL }, (_, i) => VIDEO_IDS[i % VIDEO_IDS.length]);

export function ThumbnailMosaic() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
        >
            {/* ── Thumbnail grid (Fully opaque, but masked radially) ─────────────── */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                    gridTemplateRows: `repeat(${ROWS}, 1fr)`,
                    width: "100%",
                    height: "100%",
                    gap: 3,
                    // Use CSS masking to create a perfect, smooth vignette falloff just like Algoriddim
                    // The center is 100% visible (black), softly fading to 0% visible (transparent) at the edges
                    WebkitMaskImage: "radial-gradient(ellipse 70% 80% at 50% 50%, black 25%, transparent 85%)",
                    maskImage: "radial-gradient(ellipse 70% 80% at 50% 50%, black 25%, transparent 85%)",
                }}
            >
                {tiles.map((id, i) => (
                    <div key={i} className="relative overflow-hidden">
                        <Image
                            src={`https://img.youtube.com/vi/${id}/mqdefault.jpg`}
                            alt=""
                            fill
                            sizes="(max-width: 768px) 50vw, 17vw"
                            className="object-cover"
                            style={{
                                // Boost saturation and slightly dim raw brightness for a rich, premium look
                                filter: "saturate(1.3) brightness(0.85)",
                            }}
                            unoptimized
                        />
                    </div>
                ))}
            </div>

            {/* ── Additional Center-Darkening Overlay for Text Legibility ──────── */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    // A gradient that strictly darkens the center where text sits, leaving the mid-ring vibrant
                    background: "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(10,10,10,0.7) 0%, rgba(10,10,10,0.3) 40%, transparent 100%)",
                }}
            />
        </div>
    );
}
