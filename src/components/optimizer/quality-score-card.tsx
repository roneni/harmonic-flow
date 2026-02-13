"use client";

import type { QualityScore } from "@/lib/types";

interface QualityScoreCardProps {
  label: string;
  score: QualityScore;
  improvementPercentage?: number;
}

export function QualityScoreCard({
  label,
  score,
  improvementPercentage,
}: QualityScoreCardProps) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score.overall / 100) * circumference;

  const scoreColor =
    score.overall >= 80
      ? "text-success"
      : score.overall >= 50
        ? "text-accent"
        : "text-clash";

  const ringColor =
    score.overall >= 80
      ? "stroke-success"
      : score.overall >= 50
        ? "stroke-accent"
        : "stroke-clash";

  return (
    <div className="rounded-xl border border-text-secondary/10 bg-surface p-6">
      <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-secondary">
        {label}
      </h3>

      <div className="flex items-center gap-6">
        {/* Circular progress ring */}
        <div className="relative h-32 w-32 flex-shrink-0">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-text-secondary/10"
            />
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className={`${ringColor} transition-all duration-1000`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-3xl font-bold ${scoreColor}`}>
              {score.overall}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-secondary">Harmonic</span>
            <span className="font-mono text-text-primary">
              {score.harmonicScore}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">BPM Flow</span>
            <span className="font-mono text-text-primary">
              {score.bpmFlowScore}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Perfect Transitions</span>
            <span className="font-mono text-text-primary">
              {score.perfectTransitions}/{score.totalTransitions}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Avg Distance</span>
            <span className="font-mono text-text-primary">
              {score.averageDistance}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Worst Jump</span>
            <span
              className={`font-mono ${score.worstJump <= 1 ? "text-success" : score.worstJump <= 3 ? "text-accent" : "text-clash"}`}
            >
              {score.worstJump}
            </span>
          </div>

          {improvementPercentage !== undefined && (
            <div className="mt-2 flex justify-between border-t border-text-secondary/10 pt-2">
              <span className="text-text-secondary">Improvement</span>
              <span
                className={`font-bold ${improvementPercentage > 0 ? "text-success" : "text-text-secondary"}`}
              >
                {improvementPercentage > 0 ? "+" : ""}
                {improvementPercentage}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
