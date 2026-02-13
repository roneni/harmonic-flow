import { describe, it, expect } from "vitest";
import { findOptimalKeyPath } from "@/lib/algorithm/held-karp";
import { getCamelotDistance } from "@/lib/algorithm/harmonic-distance";

function totalDistance(path: string[]): number {
  let total = 0;
  for (let i = 0; i < path.length - 1; i++) {
    total += getCamelotDistance(path[i], path[i + 1]);
  }
  return total;
}

describe("findOptimalKeyPath", () => {
  describe("trivial cases", () => {
    it("returns empty array for empty input", () => {
      expect(findOptimalKeyPath([])).toEqual([]);
    });

    it("returns single key for single input", () => {
      expect(findOptimalKeyPath(["8A"])).toEqual(["8A"]);
    });

    it("returns both keys for two inputs", () => {
      const result = findOptimalKeyPath(["8A", "9A"]);
      expect(result).toHaveLength(2);
      expect(new Set(result)).toEqual(new Set(["8A", "9A"]));
    });
  });

  describe("small paths", () => {
    it("finds optimal path for 3 adjacent keys", () => {
      const result = findOptimalKeyPath(["8A", "9A", "10A"]);
      expect(result).toHaveLength(3);
      expect(totalDistance(result)).toBe(2);
    });

    it("finds optimal path for keys that wrap around", () => {
      const result = findOptimalKeyPath(["12A", "1A", "2A"]);
      expect(result).toHaveLength(3);
      expect(totalDistance(result)).toBe(2);
    });
  });

  describe("real playlist data — verified against Python", () => {
    it("finds the optimal path for the 'best of' playlist unique keys", () => {
      // These are the 13 unique Camelot keys from the user's real playlist
      const uniqueKeys = [
        "2A", "3A", "4A", "5B", "6A", "7A",
        "8A", "8B", "9B", "10A", "10B", "11A", "11B",
      ];

      const result = findOptimalKeyPath(uniqueKeys);

      // Must contain all 13 keys
      expect(result).toHaveLength(13);
      expect(new Set(result)).toEqual(new Set(uniqueKeys));

      // Must achieve the mathematically optimal distance of 14
      const dist = totalDistance(result);
      expect(dist).toBe(14);
    });
  });

  describe("path contains all input keys", () => {
    it("includes every unique key exactly once", () => {
      const keys = ["1A", "2A", "3A", "4A", "5A"];
      const result = findOptimalKeyPath(keys);
      expect(result).toHaveLength(5);
      expect(new Set(result)).toEqual(new Set(keys));
    });
  });

  describe("cross-ring optimization", () => {
    it("handles mixed A and B keys", () => {
      const keys = ["8A", "8B", "9B", "10B"];
      const result = findOptimalKeyPath(keys);
      expect(result).toHaveLength(4);
      // Optimal: 8A→8B→9B→10B = 1+1+1 = 3
      expect(totalDistance(result)).toBe(3);
    });
  });

  describe("symmetry", () => {
    it("finds same total distance regardless of input order", () => {
      const keys1 = ["8A", "3A", "11B", "5B", "10A"];
      const keys2 = ["10A", "5B", "8A", "11B", "3A"];

      const dist1 = totalDistance(findOptimalKeyPath(keys1));
      const dist2 = totalDistance(findOptimalKeyPath(keys2));

      expect(dist1).toBe(dist2);
    });
  });
});
