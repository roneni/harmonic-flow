import type { Track, QualityScore, TransitionQuality, EnergyMode } from "@/lib/types";
import { standardizeKey } from "./standardize-key";
import { getCamelotDistance } from "./harmonic-distance";

/**
 * Calculates a comprehensive quality score (0-100) for a track sequence.
 *
 * Harmonic Score (70% of total):
 *   - Average distance (50%): lower distance = higher score
 *   - Perfect transition % (30%): more distance <= 1 transitions = higher score
 *   - Worst jump penalty (20%): larger worst jump = lower score
 *
 * BPM Flow Score (30% of total):
 *   - How well BPM progression matches the selected energy mode
 */
export function calculateScore(
  tracks: Track[],
  energyMode: EnergyMode
): QualityScore {
  const transitions: TransitionQuality[] = [];

  for (let i = 1; i < tracks.length; i++) {
    const from = tracks[i - 1];
    const to = tracks[i];
    const fromKey = standardizeKey(from.key);
    const toKey = standardizeKey(to.key);
    const distance = getCamelotDistance(fromKey, toKey);
    const bpmDelta = (to.bpm ?? 0) - (from.bpm ?? 0);

    let quality: TransitionQuality["quality"];
    if (distance <= 1) quality = "perfect";
    else if (distance === 2) quality = "good";
    else if (distance <= 3) quality = "acceptable";
    else quality = "clash";

    transitions.push({
      fromTrack: from,
      toTrack: to,
      harmonicDistance: distance,
      bpmDelta,
      quality,
    });
  }

  const validTransitions = transitions.filter((t) => t.harmonicDistance < 100);
  const totalTransitions = validTransitions.length;

  if (totalTransitions === 0) {
    return zeroScore(transitions);
  }

  const avgDistance =
    validTransitions.reduce((sum, t) => sum + t.harmonicDistance, 0) /
    totalTransitions;
  const perfectCount = validTransitions.filter(
    (t) => t.harmonicDistance <= 1
  ).length;
  const worstJump = Math.max(...validTransitions.map((t) => t.harmonicDistance));

  // Harmonic score components (each 0-100, higher = better)
  const avgDistScore = Math.max(0, Math.round(100 - (avgDistance / 6) * 100));
  const perfectPct = (perfectCount / totalTransitions) * 100;
  const worstPenalty = Math.max(
    0,
    Math.round(100 - ((worstJump - 1) / 5) * 100)
  );

  // Weighted harmonic score
  const harmonicScore = Math.round(
    avgDistScore * 0.5 + perfectPct * 0.3 + worstPenalty * 0.2
  );

  // BPM flow score
  const bpmFlowScore = calculateBpmFlowScore(validTransitions, energyMode);

  // Overall score
  const overall = Math.round(harmonicScore * 0.7 + bpmFlowScore * 0.3);

  return {
    overall,
    harmonicScore,
    bpmFlowScore,
    perfectTransitions: perfectCount,
    totalTransitions,
    averageDistance: Math.round(avgDistance * 100) / 100,
    worstJump,
    transitions,
  };
}

function calculateBpmFlowScore(
  transitions: TransitionQuality[],
  energyMode: EnergyMode
): number {
  if (transitions.length === 0) return 0;

  const bpmDeltas = transitions.map((t) => t.bpmDelta);

  if (energyMode === "ramp_up") {
    // Reward increasing BPM
    const increasing = bpmDeltas.filter((d) => d >= 0).length;
    return Math.round((increasing / bpmDeltas.length) * 100);
  }

  if (energyMode === "ramp_down") {
    // Reward decreasing BPM
    const decreasing = bpmDeltas.filter((d) => d <= 0).length;
    return Math.round((decreasing / bpmDeltas.length) * 100);
  }

  // Wave: reward alternation between increasing and decreasing
  let alternations = 0;
  for (let i = 1; i < bpmDeltas.length; i++) {
    if (
      (bpmDeltas[i] >= 0 && bpmDeltas[i - 1] < 0) ||
      (bpmDeltas[i] < 0 && bpmDeltas[i - 1] >= 0)
    ) {
      alternations++;
    }
  }
  const maxAlternations = bpmDeltas.length - 1;
  return maxAlternations > 0
    ? Math.round((alternations / maxAlternations) * 100)
    : 0;
}

function zeroScore(transitions: TransitionQuality[]): QualityScore {
  return {
    overall: 0,
    harmonicScore: 0,
    bpmFlowScore: 0,
    perfectTransitions: 0,
    totalTransitions: 0,
    averageDistance: 0,
    worstJump: 0,
    transitions,
  };
}
