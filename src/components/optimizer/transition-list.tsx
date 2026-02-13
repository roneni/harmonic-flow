"use client";

import type { TransitionQuality } from "@/lib/types";

interface TransitionListProps {
  transitions: TransitionQuality[];
}

const QUALITY_COLORS: Record<TransitionQuality["quality"], string> = {
  perfect: "bg-success",
  good: "bg-accent",
  acceptable: "bg-yellow-500",
  clash: "bg-clash",
};

const QUALITY_TEXT_COLORS: Record<TransitionQuality["quality"], string> = {
  perfect: "text-success",
  good: "text-accent",
  acceptable: "text-yellow-500",
  clash: "text-clash",
};

export function TransitionList({ transitions }: TransitionListProps) {
  return (
    <div className="space-y-1">
      {transitions.map((t, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-surface/50"
        >
          {/* Quality dot */}
          <span
            className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${QUALITY_COLORS[t.quality]}`}
          />

          {/* Track info */}
          <span className="flex-1 truncate text-text-secondary">
            <span className="text-text-primary">{t.fromTrack.title}</span>
            <span className="mx-2 opacity-40">&rarr;</span>
            <span className="text-text-primary">{t.toTrack.title}</span>
          </span>

          {/* Distance */}
          <span
            className={`flex-shrink-0 font-mono text-xs ${QUALITY_TEXT_COLORS[t.quality]}`}
          >
            {t.harmonicDistance < 100 ? t.harmonicDistance : "?"}
          </span>

          {/* BPM delta */}
          <span className="w-16 flex-shrink-0 text-right font-mono text-xs text-text-secondary">
            {t.bpmDelta > 0 ? "+" : ""}
            {t.bpmDelta !== 0 ? t.bpmDelta.toFixed(0) : "-"} bpm
          </span>
        </div>
      ))}
    </div>
  );
}
