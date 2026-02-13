import { describe, it, expect } from "vitest";
import { optimizePlaylist } from "@/lib/algorithm/optimizer";
import { standardizeKey } from "@/lib/algorithm/standardize-key";
import { getCamelotDistance } from "@/lib/algorithm/harmonic-distance";
import type { Track } from "@/lib/types";

function makeTrack(
  title: string,
  key: string,
  bpm: number | null = null,
  artist = "Artist"
): Track {
  return { artist, title, key, bpm, camelotKey: null };
}

function totalDistance(tracks: Track[]): number {
  let total = 0;
  for (let i = 0; i < tracks.length - 1; i++) {
    const k1 = standardizeKey(tracks[i].key);
    const k2 = standardizeKey(tracks[i + 1].key);
    const d = getCamelotDistance(k1, k2);
    if (d < 100) total += d;
  }
  return total;
}

// The real "best of" playlist data from the user's actual test file
const REAL_PLAYLIST: Track[] = [
  makeTrack("Lost In The Moment", "Fm", 140),
  makeTrack("Re Entry", "Am", 138),
  makeTrack("Anguish", "Am", 145),
  makeTrack("Starbound", "A", 140),
  makeTrack("Skybound", "D", 141),
  makeTrack("A New Dawn", "D", 138),
  makeTrack("From The Ashes", "Ebm", 143),
  makeTrack("Worlds Apart", "Gm", 145),
  makeTrack("Resonance", "Dm", 140),
  makeTrack("A Promise of Tomorrow", "Cm", 140),
  makeTrack("Drifting Home", "Cm", 138),
  makeTrack("Emergence", "Bb", 138),
  makeTrack("Still Waters", "Fm", 138),
  makeTrack("The Calling", "Bbm", 140),
  makeTrack("In Plain Sight", "G", 140),
  makeTrack("Horizon Pulse", "Bm", 142),
  makeTrack("Solace", "F#m", 140),
  makeTrack("A New World", "Bm", 138),
  makeTrack("The Spiral Path", "Eb", 140),
  makeTrack("Aurora Prime", "A", 144),
  makeTrack("Beneath The Waves", "Bbm", 140),
];

describe("optimizePlaylist", () => {
  describe("basic functionality", () => {
    it("returns all tracks in the output", () => {
      const result = optimizePlaylist(REAL_PLAYLIST, "ramp_up");
      expect(result.optimizedTracks).toHaveLength(REAL_PLAYLIST.length);
    });

    it("preserves all track data", () => {
      const result = optimizePlaylist(REAL_PLAYLIST, "ramp_up");
      const originalTitles = REAL_PLAYLIST.map((t) => t.title).sort();
      const optimizedTitles = result.optimizedTracks.map((t) => t.title).sort();
      expect(optimizedTitles).toEqual(originalTitles);
    });

    it("returns the original tracks unchanged", () => {
      const result = optimizePlaylist(REAL_PLAYLIST, "ramp_up");
      expect(result.originalTracks).toEqual(REAL_PLAYLIST);
    });
  });

  describe("harmonic path quality", () => {
    it("achieves optimal total distance of 14 on real playlist", () => {
      const result = optimizePlaylist(REAL_PLAYLIST, "ramp_up");

      // The harmonic path should be the Held-Karp optimal
      let pathDistance = 0;
      for (let i = 0; i < result.harmonicPath.length - 1; i++) {
        pathDistance += getCamelotDistance(
          result.harmonicPath[i],
          result.harmonicPath[i + 1]
        );
      }
      expect(pathDistance).toBe(14);
    });

    it("contains all 14 unique keys from the playlist", () => {
      const result = optimizePlaylist(REAL_PLAYLIST, "ramp_up");
      expect(result.harmonicPath).toHaveLength(14);
    });

    it("has no invalid tracks for valid input", () => {
      const result = optimizePlaylist(REAL_PLAYLIST, "ramp_up");
      expect(result.invalidTracks).toHaveLength(0);
    });
  });

  describe("improvement score", () => {
    it("shows improvement over original ordering", () => {
      const result = optimizePlaylist(REAL_PLAYLIST, "ramp_up");
      expect(result.optimizedScore.overall).toBeGreaterThanOrEqual(
        result.originalScore.overall
      );
    });

    it("calculates improvement percentage", () => {
      const result = optimizePlaylist(REAL_PLAYLIST, "ramp_up");
      expect(typeof result.improvementPercentage).toBe("number");
    });
  });

  describe("energy modes", () => {
    it("works with ramp_up mode", () => {
      const result = optimizePlaylist(REAL_PLAYLIST, "ramp_up");
      expect(result.energyMode).toBe("ramp_up");
      expect(result.optimizedTracks).toHaveLength(REAL_PLAYLIST.length);
    });

    it("works with ramp_down mode", () => {
      const result = optimizePlaylist(REAL_PLAYLIST, "ramp_down");
      expect(result.energyMode).toBe("ramp_down");
      expect(result.optimizedTracks).toHaveLength(REAL_PLAYLIST.length);
    });

    it("works with wave mode", () => {
      const result = optimizePlaylist(REAL_PLAYLIST, "wave");
      expect(result.energyMode).toBe("wave");
      expect(result.optimizedTracks).toHaveLength(REAL_PLAYLIST.length);
    });

    it("uses same harmonic path for all energy modes (only direction may differ)", () => {
      const rampUp = optimizePlaylist(REAL_PLAYLIST, "ramp_up");
      const rampDown = optimizePlaylist(REAL_PLAYLIST, "ramp_down");

      // Same set of keys in the path
      expect(new Set(rampUp.harmonicPath)).toEqual(
        new Set(rampDown.harmonicPath)
      );
    });
  });

  describe("invalid tracks", () => {
    it("appends tracks with unrecognized keys at the end", () => {
      const tracksWithInvalid = [
        ...REAL_PLAYLIST.slice(0, 3),
        makeTrack("Mystery Track", "XYZ", 140),
      ];
      const result = optimizePlaylist(tracksWithInvalid, "ramp_up");
      expect(result.invalidTracks).toHaveLength(1);
      expect(result.invalidTracks[0].title).toBe("Mystery Track");

      // Invalid track should be at the end
      const last = result.optimizedTracks[result.optimizedTracks.length - 1];
      expect(last.title).toBe("Mystery Track");
    });
  });

  describe("empty / single track", () => {
    it("handles empty playlist", () => {
      const result = optimizePlaylist([], "ramp_up");
      expect(result.optimizedTracks).toHaveLength(0);
      expect(result.harmonicPath).toHaveLength(0);
      expect(result.improvementPercentage).toBe(0);
    });

    it("handles single track", () => {
      const single = [makeTrack("Solo", "Am", 128)];
      const result = optimizePlaylist(single, "ramp_up");
      expect(result.optimizedTracks).toHaveLength(1);
      expect(result.harmonicPath).toHaveLength(1);
    });
  });

  describe("BPM sorting within key groups", () => {
    it("sorts ascending BPM within groups for ramp_up", () => {
      const tracks = [
        makeTrack("Fast Am", "Am", 145),
        makeTrack("Slow Am", "Am", 120),
        makeTrack("Mid Am", "Am", 132),
        makeTrack("One Em", "Em", 130),
      ];
      const result = optimizePlaylist(tracks, "ramp_up");

      // Find the Am group in the output
      const amTracks = result.optimizedTracks.filter(
        (t) => standardizeKey(t.key) === "8A"
      );
      // Should be sorted ascending by BPM
      for (let i = 0; i < amTracks.length - 1; i++) {
        expect(amTracks[i].bpm!).toBeLessThanOrEqual(amTracks[i + 1].bpm!);
      }
    });

    it("sorts descending BPM within groups for ramp_down", () => {
      const tracks = [
        makeTrack("Fast Am", "Am", 145),
        makeTrack("Slow Am", "Am", 120),
        makeTrack("Mid Am", "Am", 132),
        makeTrack("One Em", "Em", 130),
      ];
      const result = optimizePlaylist(tracks, "ramp_down");

      const amTracks = result.optimizedTracks.filter(
        (t) => standardizeKey(t.key) === "8A"
      );
      for (let i = 0; i < amTracks.length - 1; i++) {
        expect(amTracks[i].bpm!).toBeGreaterThanOrEqual(amTracks[i + 1].bpm!);
      }
    });
  });
});
