"use client";

import type { OptimizationResult } from "@/lib/types";
import { QualityScoreCard } from "./quality-score-card";
import { HarmonicPathViz } from "./harmonic-path-viz";
import { BeforeAfterComparison } from "./before-after-comparison";
import { TransitionList } from "./transition-list";
import { DownloadButton } from "./download-button";
import { SavePlaylistButton } from "./save-playlist-button";

interface OptimizationResultsProps {
  result: OptimizationResult;
  fileName?: string;
}

export function OptimizationResults({
  result,
  fileName,
}: OptimizationResultsProps) {
  return (
    <div className="space-y-8">
      {/* Score cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <QualityScoreCard label="Original" score={result.originalScore} />
        <QualityScoreCard
          label="Optimized"
          score={result.optimizedScore}
          improvementPercentage={result.improvementPercentage}
        />
      </div>

      {/* Harmonic path visualization */}
      <div className="rounded-xl border border-text-secondary/10 bg-surface p-6">
        <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-secondary">
          Harmonic Path — Circle of Fifths
        </h3>
        <HarmonicPathViz path={result.harmonicPath} />
      </div>

      {/* Before / After comparison */}
      <div>
        <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-secondary">
          Before &amp; After
        </h3>
        <BeforeAfterComparison
          originalTracks={result.originalTracks}
          optimizedTracks={result.optimizedTracks}
          optimizedTransitions={result.optimizedScore.transitions}
        />
      </div>

      {/* Transition details */}
      <div className="rounded-xl border border-text-secondary/10 bg-surface p-6">
        <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-secondary">
          Transition Details ({result.optimizedScore.totalTransitions} transitions)
        </h3>
        <TransitionList transitions={result.optimizedScore.transitions} />
      </div>

      {/* Actions: Download + Save */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <DownloadButton
          tracks={result.optimizedTracks}
          originalFileName={fileName}
        />
        <SavePlaylistButton
          result={result}
          defaultName={fileName || "Untitled Playlist"}
        />
      </div>
    </div>
  );
}
