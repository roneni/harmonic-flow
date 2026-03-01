import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "HarmonySet — DJ Playlist Optimizer for Harmonic Mixing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow effect top-left */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(132,204,22,0.15) 0%, transparent 70%)",
            display: "flex",
          }}
        />
        {/* Glow effect bottom-right */}
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(132,204,22,0.10) 0%, transparent 70%)",
            display: "flex",
          }}
        />
        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            position: "relative",
          }}
        >
          {/* Brand */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-2px",
              display: "flex",
            }}
          >
            Harmony
            <span style={{ color: "#84CC16" }}>Set</span>
          </div>
          {/* Tagline */}
          <div
            style={{
              fontSize: 32,
              fontWeight: 600,
              color: "#84CC16",
              display: "flex",
            }}
          >
            DJ Playlist Optimizer
          </div>
          {/* Description */}
          <div
            style={{
              fontSize: 20,
              color: "#94a3b8",
              marginTop: "8px",
              display: "flex",
            }}
          >
            Mathematically perfect harmonic mixing • Free & Private
          </div>
          {/* Software badges */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "24px",
            }}
          >
            {["Rekordbox", "Traktor", "Serato"].map((name) => (
              <div
                key={name}
                style={{
                  padding: "8px 20px",
                  borderRadius: "999px",
                  border: "1px solid rgba(132,204,22,0.3)",
                  backgroundColor: "rgba(132,204,22,0.05)",
                  color: "#84CC16",
                  fontSize: 16,
                  fontWeight: 500,
                  display: "flex",
                }}
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
