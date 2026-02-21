"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// ---------------------------------------------------------------------------
// VIDEO CONFIG
// Replace VIDEO_ID values with the actual YouTube video IDs from the
// Psychedelic Universe channel once you have them.
// The fallback view counts display immediately; live counts load via the API.
// ---------------------------------------------------------------------------
const VIDEOS: VideoEntry[] = [
  {
    id: "VIDEO_ID_1", // Back to Goa | Retro Goa Trance DJ Mix
    title: "Back to Goa | Retro Goa Trance DJ Mix",
    fallbackViews: 479437,
  },
  {
    id: "VIDEO_ID_2", // Dreaming of Goa | Tribute to Goa DJ Mix
    title: "Dreaming of Goa | Tribute to Goa DJ Mix",
    fallbackViews: 206553,
  },
  {
    id: "VIDEO_ID_3", // January 2022 Progressive Psytrance DJ Mix
    title: "January 2022 Progressive Psytrance DJ Mix",
    fallbackViews: 172813,
  },
  {
    id: "VIDEO_ID_4", // Vini Vici - Life Is a Remix DJ Mix
    title: "Vini Vici - Life Is a Remix DJ Mix",
    fallbackViews: 100330,
  },
  {
    id: "VIDEO_ID_5", // Psychedelic Soul - Liquid Soul Best Of Ever DJ Mix
    title: "Psychedelic Soul - Liquid Soul Best Of Ever DJ Mix",
    fallbackViews: 96680,
  },
  {
    id: "VIDEO_ID_6", // ProtonMix | Protonica Best Tracks Ever DJ Mix
    title: "ProtonMix | Protonica Best Tracks Ever DJ Mix",
    fallbackViews: 74543,
  },
  {
    id: "VIDEO_ID_7", // Best of Captain Hook | Progressive Psytrance DJ Mix
    title: "Best of Captain Hook | Progressive Psytrance DJ Mix",
    fallbackViews: 73208,
  },
  {
    id: "VIDEO_ID_8", // June 2023 Progressive Psytrance DJ Mix
    title: "June 2023 Progressive Psytrance DJ Mix",
    fallbackViews: 66524,
  },
];

interface VideoEntry {
  id: string;
  title: string;
  fallbackViews: number;
}

interface LiveStats {
  [videoId: string]: number;
}

function formatViews(count: number): string {
  if (count >= 1_000_000) {
    return (count / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (count >= 1_000) {
    return count.toLocaleString();
  }
  return count.toString();
}

function ThumbnailImage({ videoId, title }: { videoId: string; title: string }) {
  const isPlaceholder = videoId.startsWith("VIDEO_ID_");
  const src = isPlaceholder
    ? null
    : `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

  if (!src) {
    // Render a styled placeholder when video ID hasn't been set yet
    return (
      <div
        className="flex items-center justify-center text-xs font-mono shrink-0"
        style={{
          width: 160,
          height: 90,
          background: "#1a1a1a",
          border: "1px solid #2a2a2a",
          color: "#555555",
          borderRadius: 4,
        }}
      >
        <span>[ thumbnail ]</span>
      </div>
    );
  }

  return (
    <div
      className="relative shrink-0 overflow-hidden"
      style={{ width: 160, height: 90, borderRadius: 4 }}
    >
      <Image
        src={src}
        alt={title}
        fill
        sizes="160px"
        className="object-cover"
        unoptimized
      />
    </div>
  );
}

function VideoCard({
  entry,
  liveViews,
}: {
  entry: VideoEntry;
  liveViews?: number;
}) {
  const viewCount = liveViews ?? entry.fallbackViews;
  const videoUrl = entry.id.startsWith("VIDEO_ID_")
    ? "#"
    : `https://www.youtube.com/watch?v=${entry.id}`;

  return (
    <a
      href={videoUrl}
      target={videoUrl === "#" ? undefined : "_blank"}
      rel="noopener noreferrer"
      className="flex flex-col gap-2 shrink-0 group"
      style={{ width: 200 }}
      aria-label={entry.title}
    >
      <div className="overflow-hidden" style={{ borderRadius: 4 }}>
        <ThumbnailImage videoId={entry.id} title={entry.title} />
      </div>
      <div className="flex flex-col gap-0.5">
        <p
          className="text-xs font-medium leading-tight line-clamp-2 group-hover:text-white transition-colors"
          style={{ color: "#cccccc" }}
        >
          {entry.title}
        </p>
        <p className="text-xs font-mono font-semibold" style={{ color: "#84cc16" }}>
          {formatViews(viewCount)} views
        </p>
      </div>
    </a>
  );
}

export function YouTubeStrip() {
  const [liveStats, setLiveStats] = useState<LiveStats>({});

  useEffect(() => {
    const realIds = VIDEOS.filter((v) => !v.id.startsWith("VIDEO_ID_")).map(
      (v) => v.id
    );
    if (realIds.length === 0) return;

    fetch(`/api/youtube-stats?ids=${realIds.join(",")}`)
      .then((res) => res.json())
      .then((data: LiveStats) => setLiveStats(data))
      .catch(() => {
        // Silently fall back to hardcoded data
      });
  }, []);

  // Duplicate the array for seamless infinite loop
  const doubled = [...VIDEOS, ...VIDEOS];

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height: 140,
        background: "#0a0a0a",
        borderTop: "1px solid #1a1a1a",
        borderBottom: "1px solid #1a1a1a",
      }}
    >
      {/* Left gradient fade */}
      <div
        className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none"
        style={{
          width: 80,
          background:
            "linear-gradient(to right, #0a0a0a 0%, transparent 100%)",
        }}
      />

      {/* Right gradient fade */}
      <div
        className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none"
        style={{
          width: 80,
          background:
            "linear-gradient(to left, #0a0a0a 0%, transparent 100%)",
        }}
      />

      {/* Scrolling track */}
      <div
        className="flex items-center animate-scroll-left"
        style={{
          height: "100%",
          width: "max-content",
          gap: 24,
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        {doubled.map((entry, index) => (
          <VideoCard
            key={`${entry.id}-${index}`}
            entry={entry}
            liveViews={liveStats[entry.id]}
          />
        ))}
      </div>
    </div>
  );
}
