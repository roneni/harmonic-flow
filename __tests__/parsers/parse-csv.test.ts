import { describe, it, expect } from "vitest";
import { parseCsv } from "@/lib/parsers/parse-csv";

describe("parseCsv", () => {
  it("parses standard comma-delimited CSV", () => {
    const csv = `Track Title,BPM,Key,Artist
Dimension,138.0,Am,Ritmo
Big Eyes,140.0,Gm,Motion Drive`;

    const tracks = parseCsv(csv);
    expect(tracks).toHaveLength(2);
    expect(tracks[0].title).toBe("Dimension");
    expect(tracks[0].bpm).toBe(138);
    expect(tracks[0].key).toBe("Am");
    expect(tracks[0].artist).toBe("Ritmo");
    expect(tracks[1].title).toBe("Big Eyes");
  });

  it("parses tab-delimited CSV", () => {
    const csv = "Track Title\tBPM\tKey\nSong One\t135\tFm\nSong Two\t140\tGm";
    const tracks = parseCsv(csv);
    expect(tracks).toHaveLength(2);
    expect(tracks[0].title).toBe("Song One");
    expect(tracks[0].bpm).toBe(135);
  });

  it("parses semicolon-delimited CSV", () => {
    const csv = "Title;BPM;Key;Artist\nTrack A;142;Dm;DJ X\nTrack B;138;Am;DJ Y";
    const tracks = parseCsv(csv);
    expect(tracks).toHaveLength(2);
    expect(tracks[0].title).toBe("Track A");
  });

  it("handles quoted fields with embedded commas", () => {
    const csv = `Title,Artist,BPM,Key
"Hello, World",Test Artist,128,Am`;
    const tracks = parseCsv(csv);
    expect(tracks).toHaveLength(1);
    expect(tracks[0].title).toBe("Hello, World");
  });

  it("handles Rekordbox CSV format with extra columns", () => {
    const csv = `#,Track number,Track Title,BPM,Time,Key,Genre,Date Added
15,8,Reverse - Dark Silence,137.0,08:40,Ebm,,2024-10-27
9,9,Multidimensional Experience,138.01,06:43,Ebm,8 hi down,2024-10-24`;

    const tracks = parseCsv(csv);
    expect(tracks).toHaveLength(2);
    expect(tracks[0].title).toBe("Reverse - Dark Silence");
    expect(tracks[0].bpm).toBe(137);
    expect(tracks[0].key).toBe("Ebm");
  });

  it("returns empty for file without key column", () => {
    const csv = "Title,BPM\nSong,128";
    const tracks = parseCsv(csv);
    expect(tracks).toHaveLength(0);
  });

  it("skips rows without key data", () => {
    const csv = `Title,Key,BPM
Song A,Am,128
Song B,,130
Song C,Dm,135`;
    const tracks = parseCsv(csv);
    expect(tracks).toHaveLength(2);
    expect(tracks[0].title).toBe("Song A");
    expect(tracks[1].title).toBe("Song C");
  });

  it("handles missing BPM gracefully", () => {
    const csv = `Title,Key,BPM
Song A,Am,
Song B,Dm,135`;
    const tracks = parseCsv(csv);
    expect(tracks).toHaveLength(2);
    expect(tracks[0].bpm).toBeNull();
    expect(tracks[1].bpm).toBe(135);
  });

  it("returns empty for empty input", () => {
    expect(parseCsv("")).toHaveLength(0);
    expect(parseCsv("  \n  ")).toHaveLength(0);
  });

  it("returns empty for header-only file", () => {
    expect(parseCsv("Title,Key,BPM")).toHaveLength(0);
  });
});
