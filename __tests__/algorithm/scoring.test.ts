import { describe, it, expect } from "vitest";
import { calculateScore } from "@/lib/algorithm/scoring";
import type { Track } from "@/lib/types";

function makeTrack(key: string, bpm: number | null = null): Track {
  return { artist: "Test", title: "Test", key, bpm, camelotKey: null };
}

describe("calculateScore", () => {
  describe("zero/edge cases", () => {
    it("returns zero score for single track", () => {
      const score = calculateScore([makeTrack("Am")], "ramp_up");
      expect(score.overall).toBe(0);
      expect(score.totalTransitions).toBe(0);
    });

    it("returns zero score for empty array", () => {
      const score = calculateScore([], "ramp_up");
      expect(score.overall).toBe(0);
    });
  });

  describe("perfect transitions", () => {
    it("scores high for all distance-1 transitions", () => {
      const tracks = [
        makeTrack("Am"),  // 8A
        makeTrack("Em"),  // 9A
        makeTrack("Bm"),  // 10A
        makeTrack("F#m"), // 11A
      ];
      const score = calculateScore(tracks, "ramp_up");
      expect(score.harmonicScore).toBeGreaterThanOrEqual(90);
      expect(score.perfectTransitions).toBe(3);
      expect(score.totalTransitions).toBe(3);
      expect(score.averageDistance).toBe(1);
      expect(score.worstJump).toBe(1);
    });
  });

  describe("poor transitions", () => {
    it("scores low for large distance transitions", () => {
      const tracks = [
        makeTrack("Am"),  // 8A
        makeTrack("Ebm"), // 2A — distance 6 from 8A
        makeTrack("F#m"), // 11A — distance 3 from 2A
      ];
      const score = calculateScore(tracks, "ramp_up");
      expect(score.harmonicScore).toBeLessThan(50);
      expect(score.worstJump).toBe(6);
    });
  });

  describe("transition quality labels", () => {
    it("labels transitions correctly", () => {
      const tracks = [
        makeTrack("Am"),  // 8A
        makeTrack("Em"),  // 9A — distance 1 = perfect
        makeTrack("G"),   // 9B — distance 1 (relative) = perfect
        makeTrack("D"),   // 10B — distance 1 = perfect
        makeTrack("Cm"),  // 5A — distance 6 = clash
      ];
      const score = calculateScore(tracks, "ramp_up");
      expect(score.transitions[0].quality).toBe("perfect");
      expect(score.transitions[1].quality).toBe("perfect");
      expect(score.transitions[2].quality).toBe("perfect");
      expect(score.transitions[3].quality).toBe("clash");
    });
  });

  describe("BPM flow scoring", () => {
    it("rewards ascending BPM for ramp_up mode", () => {
      const tracks = [
        makeTrack("Am", 120),
        makeTrack("Em", 125),
        makeTrack("Bm", 130),
        makeTrack("F#m", 135),
      ];
      const score = calculateScore(tracks, "ramp_up");
      expect(score.bpmFlowScore).toBe(100);
    });

    it("rewards descending BPM for ramp_down mode", () => {
      const tracks = [
        makeTrack("Am", 135),
        makeTrack("Em", 130),
        makeTrack("Bm", 125),
        makeTrack("F#m", 120),
      ];
      const score = calculateScore(tracks, "ramp_down");
      expect(score.bpmFlowScore).toBe(100);
    });

    it("penalizes ascending BPM in ramp_down mode", () => {
      const tracks = [
        makeTrack("Am", 120),
        makeTrack("Em", 125),
        makeTrack("Bm", 130),
        makeTrack("F#m", 135),
      ];
      const score = calculateScore(tracks, "ramp_down");
      // All transitions go up, so decreasing count = 0 out of 3
      expect(score.bpmFlowScore).toBe(0);
    });

    it("rewards alternation for wave mode", () => {
      const tracks = [
        makeTrack("Am", 120),
        makeTrack("Em", 130), // up
        makeTrack("Bm", 125), // down
        makeTrack("F#m", 135), // up
        makeTrack("C#m", 128), // down
      ];
      const score = calculateScore(tracks, "wave");
      // All 3 transitions between adjacent pairs alternate: up→down, down→up, up→down
      expect(score.bpmFlowScore).toBe(100);
    });
  });

  describe("overall score weighting", () => {
    it("blends harmonic (70%) and BPM flow (30%)", () => {
      const tracks = [
        makeTrack("Am", 120),
        makeTrack("Em", 125),
        makeTrack("Bm", 130),
      ];
      const score = calculateScore(tracks, "ramp_up");
      // Overall = round(harmonicScore * 0.7 + bpmFlowScore * 0.3)
      const expected = Math.round(score.harmonicScore * 0.7 + score.bpmFlowScore * 0.3);
      expect(score.overall).toBe(expected);
    });
  });

  describe("null key handling", () => {
    it("treats null keys as distance 100 (filtered out)", () => {
      const tracks = [
        makeTrack("Am"),
        makeTrack("???"), // standardizeKey returns null
        makeTrack("Em"),
      ];
      const score = calculateScore(tracks, "ramp_up");
      // The ??? key causes distance 100 which gets filtered
      const validTransitions = score.transitions.filter(
        (t) => t.harmonicDistance < 100
      );
      expect(validTransitions.length).toBeLessThan(score.transitions.length);
    });
  });
});
