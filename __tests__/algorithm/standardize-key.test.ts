import { describe, it, expect } from "vitest";
import { standardizeKey } from "@/lib/algorithm/standardize-key";

describe("standardizeKey", () => {
  describe("already Camelot notation", () => {
    it("passes through standard Camelot codes", () => {
      expect(standardizeKey("8A")).toBe("8A");
      expect(standardizeKey("12B")).toBe("12B");
      expect(standardizeKey("1A")).toBe("1A");
      expect(standardizeKey("6B")).toBe("6B");
    });
  });

  describe("standard musical keys", () => {
    it("maps major keys to B side", () => {
      expect(standardizeKey("C")).toBe("8B");
      expect(standardizeKey("G")).toBe("9B");
      expect(standardizeKey("D")).toBe("10B");
      expect(standardizeKey("A")).toBe("11B");
      expect(standardizeKey("E")).toBe("12B");
      expect(standardizeKey("B")).toBe("1B");
      expect(standardizeKey("F#")).toBe("2B");
      expect(standardizeKey("F")).toBe("7B");
    });

    it("maps minor keys to A side", () => {
      expect(standardizeKey("Am")).toBe("8A");
      expect(standardizeKey("Em")).toBe("9A");
      expect(standardizeKey("Bm")).toBe("10A");
      expect(standardizeKey("F#m")).toBe("11A");
      expect(standardizeKey("C#m")).toBe("12A");
      expect(standardizeKey("Dm")).toBe("7A");
      expect(standardizeKey("Gm")).toBe("6A");
      expect(standardizeKey("Cm")).toBe("5A");
      expect(standardizeKey("Fm")).toBe("4A");
    });

    it("handles enharmonic equivalents", () => {
      expect(standardizeKey("Gb")).toBe("2B");
      expect(standardizeKey("F#")).toBe("2B");
      expect(standardizeKey("Db")).toBe("3B");
      expect(standardizeKey("C#")).toBe("3B");
      expect(standardizeKey("Ab")).toBe("4B");
      expect(standardizeKey("Eb")).toBe("5B");
      expect(standardizeKey("Bb")).toBe("6B");
      expect(standardizeKey("G#m")).toBe("1A");
      expect(standardizeKey("Abm")).toBe("1A");
      expect(standardizeKey("D#m")).toBe("2A");
      expect(standardizeKey("Ebm")).toBe("2A");
      expect(standardizeKey("A#m")).toBe("3A");
      expect(standardizeKey("Bbm")).toBe("3A");
    });
  });

  describe("long-form notation", () => {
    it("handles maj/min suffixes", () => {
      expect(standardizeKey("Cmaj")).toBe("8B");
      expect(standardizeKey("Amin")).toBe("8A");
      expect(standardizeKey("F#maj")).toBe("2B");
      expect(standardizeKey("Bbmin")).toBe("3A");
      expect(standardizeKey("Emaj")).toBe("12B");
      expect(standardizeKey("Emin")).toBe("9A");
    });
  });

  describe("Open Key notation", () => {
    it("maps d (major) to B side", () => {
      expect(standardizeKey("1d")).toBe("1B");
      expect(standardizeKey("8d")).toBe("8B");
      expect(standardizeKey("12d")).toBe("12B");
    });

    it("maps m (minor) to A side", () => {
      expect(standardizeKey("1m")).toBe("1A");
      expect(standardizeKey("8m")).toBe("8A");
      expect(standardizeKey("12m")).toBe("12A");
    });
  });

  describe("leading zeros", () => {
    it("strips leading zeros from Camelot codes", () => {
      expect(standardizeKey("08A")).toBe("8A");
      expect(standardizeKey("01B")).toBe("1B");
      expect(standardizeKey("09A")).toBe("9A");
    });
  });

  describe("case insensitive fallback", () => {
    it("handles lowercase musical keys", () => {
      expect(standardizeKey("am")).toBe("8A");
      expect(standardizeKey("em")).toBe("9A");
      expect(standardizeKey("cmaj")).toBe("8B");
      expect(standardizeKey("f#m")).toBe("11A");
    });
  });

  describe("whitespace handling", () => {
    it("trims whitespace", () => {
      expect(standardizeKey("  Am  ")).toBe("8A");
      expect(standardizeKey(" 8A ")).toBe("8A");
    });
  });

  describe("invalid inputs", () => {
    it("returns null for non-string input", () => {
      expect(standardizeKey(null)).toBeNull();
      expect(standardizeKey(undefined)).toBeNull();
      expect(standardizeKey(123)).toBeNull();
    });

    it("returns null for empty strings", () => {
      expect(standardizeKey("")).toBeNull();
      expect(standardizeKey("   ")).toBeNull();
    });

    it("returns null for unrecognized keys", () => {
      expect(standardizeKey("XYZ")).toBeNull();
      expect(standardizeKey("13A")).toBeNull();
      expect(standardizeKey("0B")).toBeNull();
    });
  });
});
