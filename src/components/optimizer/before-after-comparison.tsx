"use client";

import type { Track, TransitionQuality } from "@/lib/types";
import { standardizeKey, getCamelotDistance, CAMELOT_TO_KEY } from "@/lib/algorithm";

interface BeforeAfterComparisonProps {
  originalTracks: Track[];
  optimizedTracks: Track[];
  optimizedTransitions: TransitionQuality[];
}

function getTransitionDot(
  track: Track,
  nextTrack: Track | undefined
): { color: string; distance: number | null } {
  if (!nextTrack) return { color: "", distance: null };

  const k1 = standardizeKey(track.key);
  const k2 = standardizeKey(nextTrack.key);
  const dist = getCamelotDistance(k1, k2);

  if (dist >= 100) return { color: "bg-text-secondary/30", distance: null };
  if (dist <= 1) return { color: "bg-success", distance: dist };
  if (dist === 2) return { color: "bg-accent", distance: dist };
  if (dist <= 3) return { color: "bg-yellow-500", distance: dist };
  return { color: "bg-clash", distance: dist };
}

function CompactTrackList({
  tracks,
  label,
}: {
  tracks: Track[];
  label: string;
}) {
  return (
    <div>
      <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-text-secondary">
        {label}
      </h4>
      <div className="space-y-0.5">
        {tracks.map((track, i) => {
          const camelot = standardizeKey(track.key);
          const displayKey = camelot
            ? CAMELOT_TO_KEY[camelot] || track.key
            : track.key;
          const dot = getTransitionDot(track, tracks[i + 1]);

          return (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="w-6 flex-shrink-0 text-right font-mono text-xs text-text-secondary">
                {i + 1}
              </span>
              <span className="flex-1 truncate text-text-primary">
                {track.title}
              </span>
              <span className="w-14 flex-shrink-0 text-right font-mono text-xs text-text-secondary">
                {track.bpm ?? "—"}
              </span>
              <span className="w-10 flex-shrink-0 text-center font-mono text-xs text-text-primary">
                {displayKey}
              </span>
              {dot.distance !== null ? (
                <span
                  className={`h-2 w-2 flex-shrink-0 rounded-full ${dot.color}`}
                  title={`Distance: ${dot.distance}`}
                />
              ) : (
                <span className="h-2 w-2 flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function BeforeAfterComparison({
  originalTracks,
  optimizedTracks,
}: BeforeAfterComparisonProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-text-secondary/10 bg-surface/50 p-4">
        <CompactTrackList tracks={originalTracks} label="Original Order" />
      </div>
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <CompactTrackList tracks={optimizedTracks} label="Optimized Order" />
      </div>
    </div>
  );
}
