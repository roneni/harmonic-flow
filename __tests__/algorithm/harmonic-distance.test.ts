import { describe, it, expect } from "vitest";
import { getCamelotDistance } from "@/lib/algorithm/harmonic-distance";

describe("getCamelotDistance", () => {
  describe("same key", () => {
    it("returns 0 for identical keys", () => {
      expect(getCamelotDistance("8A", "8A")).toBe(0);
      expect(getCamelotDistance("1B", "1B")).toBe(0);
      expect(getCamelotDistance("12A", "12A")).toBe(0);
    });
  });

  describe("relative major/minor (same number, A<->B)", () => {
    it("returns 1 for relative major/minor pairs", () => {
      expect(getCamelotDistance("8A", "8B")).toBe(1);
      expect(getCamelotDistance("8B", "8A")).toBe(1);
      expect(getCamelotDistance("1A", "1B")).toBe(1);
      expect(getCamelotDistance("12A", "12B")).toBe(1);
    });
  });

  describe("adjacent keys on same ring", () => {
    it("returns 1 for adjacent numbers on same letter", () => {
      expect(getCamelotDistance("8A", "9A")).toBe(1);
      expect(getCamelotDistance("9A", "8A")).toBe(1);
      expect(getCamelotDistance("8B", "9B")).toBe(1);
      expect(getCamelotDistance("5A", "6A")).toBe(1);
    });
  });

  describe("wrapping around 12->1", () => {
    it("returns 1 for 12->1 wrap on same ring", () => {
      expect(getCamelotDistance("12A", "1A")).toBe(1);
      expect(getCamelotDistance("1A", "12A")).toBe(1);
      expect(getCamelotDistance("12B", "1B")).toBe(1);
      expect(getCamelotDistance("1B", "12B")).toBe(1);
    });
  });

  describe("same ring, various distances", () => {
    it("calculates correct distance on same ring", () => {
      expect(getCamelotDistance("1A", "3A")).toBe(2);
      expect(getCamelotDistance("1A", "7A")).toBe(6);
      // 1A -> 8A: clockwise 7, counter-clockwise 5. Min = 5
      expect(getCamelotDistance("1A", "8A")).toBe(5);
      // 1A -> 6A: clockwise 5, counter-clockwise 7. Min = 5
      expect(getCamelotDistance("1A", "6A")).toBe(5);
    });

    it("takes the shorter path around the circle", () => {
      // 2A -> 10A: clockwise 8, counter-clockwise 4. Min = 4
      expect(getCamelotDistance("2A", "10A")).toBe(4);
      // 1A -> 7A: exactly 6 both ways
      expect(getCamelotDistance("1A", "7A")).toBe(6);
    });
  });

  describe("cross-ring transitions", () => {
    it("returns numDiff + 1 for different ring and different number", () => {
      // 8A -> 9B: numDiff=1, different letter -> 1 + 1 = 2
      expect(getCamelotDistance("8A", "9B")).toBe(2);
      // 2A -> 11B: numDiff = min(9, 3) = 3, different letter -> 3 + 1 = 4
      expect(getCamelotDistance("2A", "11B")).toBe(4);
    });
  });

  describe("null inputs", () => {
    it("returns 100 for any null input", () => {
      expect(getCamelotDistance(null, "8A")).toBe(100);
      expect(getCamelotDistance("8A", null)).toBe(100);
      expect(getCamelotDistance(null, null)).toBe(100);
    });
  });

  describe("known distances from real playlist", () => {
    // These match the verified Python output for the "best of" playlist
    it("confirms transitions from the known optimal path", () => {
      // Optimal path: 2A→3A→4A→5B→6A→7A→8A→8B→9B→10B→11B→11A→10A
      expect(getCamelotDistance("2A", "3A")).toBe(1);
      expect(getCamelotDistance("3A", "4A")).toBe(1);
      expect(getCamelotDistance("4A", "5B")).toBe(2); // cross ring + 1 step
      expect(getCamelotDistance("5B", "6A")).toBe(2); // cross ring + 1 step
      expect(getCamelotDistance("6A", "7A")).toBe(1);
      expect(getCamelotDistance("7A", "8A")).toBe(1);
      expect(getCamelotDistance("8A", "8B")).toBe(1); // relative major/minor
      expect(getCamelotDistance("8B", "9B")).toBe(1);
      expect(getCamelotDistance("9B", "10B")).toBe(1);
      expect(getCamelotDistance("10B", "11B")).toBe(1);
      expect(getCamelotDistance("11B", "11A")).toBe(1); // relative major/minor
      expect(getCamelotDistance("11A", "10A")).toBe(1);
    });

    it("sums to total distance 14 for the optimal path", () => {
      const path = ["2A", "3A", "4A", "5B", "6A", "7A", "8A", "8B", "9B", "10B", "11B", "11A", "10A"];
      let total = 0;
      for (let i = 0; i < path.length - 1; i++) {
        total += getCamelotDistance(path[i], path[i + 1]);
      }
      expect(total).toBe(14);
    });
  });
});
