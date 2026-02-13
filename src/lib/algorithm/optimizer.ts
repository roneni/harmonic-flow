import type { Track, OptimizationResult, EnergyMode } from "@/lib/types";
import { standardizeKey } from "./standardize-key";
import { findOptimalKeyPath } from "./held-karp";
import { calculateScore } from "./scoring";

/**
 * Optimizes a playlist for harmonic mixing using the circle of fifths.
 *
 * 1. Standardizes all keys to internal notation
 * 2. Finds the mathematically optimal key path (Held-Karp algorithm)
 * 3. Chooses path direction based on energy mode + BPM
 * 4. Sorts tracks within each key group by BPM
 * 5. Calculates quality scores for before/after comparison
 */
export function optimizePlaylist(
  tracks: Track[],
  energyMode: EnergyMode
): OptimizationResult {
  // 1. Standardize all keys
  const tracksWithKeys = tracks.map((t) => ({
    ...t,
    camelotKey: standardizeKey(t.key),
  }));

  const validTracks = tracksWithKeys.filter((t) => t.camelotKey !== null);
  const invalidTracks = tracksWithKeys.filter((t) => t.camelotKey === null);

  if (validTracks.length === 0) {
    return {
      originalTracks: tracks,
      optimizedTracks: [...tracks],
      invalidTracks,
      harmonicPath: [],
      originalScore: calculateScore(tracks, energyMode),
      optimizedScore: calculateScore(tracks, energyMode),
      improvementPercentage: 0,
      energyMode,
    };
  }

  // 2. Group by key
  const groups = new Map<string, Track[]>();
  for (const track of validTracks) {
    const key = track.camelotKey!;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(track);
  }

  const uniqueKeys = Array.from(groups.keys());

  // 3. Find optimal key ordering (Held-Karp)
  let optimalPath = findOptimalKeyPath(uniqueKeys);

  // 4. Choose direction based on energy mode + BPM
  if (validTracks.some((t) => t.bpm !== null) && optimalPath.length >= 2) {
    const firstGroupBpm = avgBpm(groups.get(optimalPath[0])!);
    const lastGroupBpm = avgBpm(groups.get(optimalPath[optimalPath.length - 1])!);

    if (energyMode === "ramp_up" && firstGroupBpm > lastGroupBpm) {
      optimalPath = [...optimalPath].reverse();
    } else if (energyMode === "ramp_down" && firstGroupBpm < lastGroupBpm) {
      optimalPath = [...optimalPath].reverse();
    }
  }

  // 5. Sort tracks within each key group by BPM
  const optimizedTracks: Track[] = [];

  for (let idx = 0; idx < optimalPath.length; idx++) {
    const key = optimalPath[idx];
    const group = [...groups.get(key)!];

    if (group.some((t) => t.bpm !== null)) {
      if (energyMode === "ramp_up") {
        group.sort((a, b) => (a.bpm ?? 0) - (b.bpm ?? 0));
      } else if (energyMode === "ramp_down") {
        group.sort((a, b) => (b.bpm ?? 0) - (a.bpm ?? 0));
      } else if (energyMode === "wave") {
        // Alternate ascending/descending within each key group
        if (idx % 2 === 0) {
          group.sort((a, b) => (a.bpm ?? 0) - (b.bpm ?? 0));
        } else {
          group.sort((a, b) => (b.bpm ?? 0) - (a.bpm ?? 0));
        }
      }
    }

    optimizedTracks.push(...group);
  }

  // Append invalid tracks at the end
  optimizedTracks.push(...invalidTracks);

  // 6. Calculate scores
  const originalScore = calculateScore(tracks, energyMode);
  const optimizedScore = calculateScore(optimizedTracks, energyMode);

  const improvement =
    originalScore.overall > 0
      ? Math.round(
          ((optimizedScore.overall - originalScore.overall) /
            originalScore.overall) *
            100
        )
      : optimizedScore.overall > 0
        ? 100
        : 0;

  return {
    originalTracks: tracks,
    optimizedTracks,
    invalidTracks,
    harmonicPath: optimalPath,
    originalScore,
    optimizedScore,
    improvementPercentage: improvement,
    energyMode,
  };
}

function avgBpm(tracks: Track[]): number {
  const withBpm = tracks.filter((t) => t.bpm !== null);
  if (withBpm.length === 0) return 0;
  return withBpm.reduce((sum, t) => sum + t.bpm!, 0) / withBpm.length;
}
