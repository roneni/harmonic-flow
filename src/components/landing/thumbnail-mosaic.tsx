"use client";

import Image from "next/image";

// ---------------------------------------------------------------------------
// Psychedelic Universe video IDs — beautifully arranged 6x6 grid
// Darkest thumbnails placed in the center for text legibility.
// Videos maintain their original high-quality 1080p 16:9 aspect ratio.
// ---------------------------------------------------------------------------
const D1 = "J6fC0ji59xo"; // dark
const D2 = "K_66Gnv7wKY"; // dark
const D3 = "XOLAgFQwHu4"; // dark
const D4 = "WQtqZOBfNd0"; // dark
const D5 = "wqzvRgXVunc"; // dark

// The remaining 20 colorful IDs
const C = [
    "JfLMADyiYVE", "0az2NYzGGbw", "rrdQIQXQF8I", "sn0pgbuKfUY", "PRdcytOMvn4",
    "PZe5PqUDjBU", "2rYGCA7bdFU", "hdNoYygg2aI", "UwHkETjnSq0", "c2ExXW1SpGM",
    "ufJoZwwjbtI", "mSG6HjGu528", "CeTlphXFTmA", "NL2QaSmia1c", "jW46QoPu720",
    "wHagWQ6XT0U", "_sBMbvooqI0", "jqQwdApbg2c", "OltmDX-g3Fs", "kM7IP1sjwkY"
];

const COLS = 6;
const ROWS = 6;

// Center mapping to put the dark videos directly behind the text.
const tiles = [
    // Row 0
    C[0], C[1], C[2], C[3], C[4], C[5],
    // Row 1
    C[6], C[7], C[8], C[9], C[10], C[11],
    // Row 2 (dark center at cols 1,2,3)
    C[12], D1, D2, D3, C[13], C[14],
    // Row 3 (dark center at cols 1,2)
    C[15], D4, D5, C[16], C[17], C[18],
    // Row 4
    C[19], C[0], C[1], C[2], C[3], C[4],
    // Row 5
    C[5], C[6], C[7], C[8], C[9], C[10],
];

export function ThumbnailMosaic() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
            style={{ perspective: "1000px" }}
        >
            {/* ── Thumbnail grid (Absolute positioning avoids grid distortion) ─────────────── */}
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    display: "grid",
                    gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                    width: "140vw",
                    minWidth: "1200px", // Ensures it never shrinks too small on mobile
                    gap: 16, // Pronounced black gap organically separating the images
                    // The center is 100% visible (black), softly fading to 0% visible (transparent) at the edges
                    WebkitMaskImage: "radial-gradient(ellipse 65% 75% at 50% 50%, black 25%, transparent 75%)",
                    maskImage: "radial-gradient(ellipse 65% 75% at 50% 50%, black 25%, transparent 75%)",
                }}
            >
                {tiles.map((id, i) => (
                    <div
                        key={i}
                        className="relative overflow-hidden rounded-sm"
                        style={{ aspectRatio: "16 / 9" }}
                    >
                        <Image
                            src={`https://img.youtube.com/vi/${id}/maxresdefault.jpg`}
                            alt=""
                            fill
                            sizes="(max-width: 768px) 30vw, 20vw"
                            className="object-cover"
                            style={{
                                filter: "saturate(1.2)",
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
                    background: "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.2) 60%, transparent 100%)",
                }}
            />
        </div>
    );
}
