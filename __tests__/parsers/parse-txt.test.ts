import { describe, it, expect } from "vitest";
import { parseTxt, decodeTxtBuffer } from "@/lib/parsers/parse-txt";

describe("parseTxt", () => {
  it("parses tab-delimited text with standard headers", () => {
    const txt = [
      "#\tTrack number\tTrack Title\tBPM\tTime\tKey\tGenre\tDate Added",
      "1\t11\tSonic Species - TFC\t138.00\t07:59\tFm\t10\t2024-10-24",
      "2\t10\tEctima - Python\t142.00\t05:49\tFm\t6-7\t2024-10-24",
    ].join("\n");

    const tracks = parseTxt(txt);
    expect(tracks).toHaveLength(2);
    expect(tracks[0].title).toBe("Sonic Species - TFC");
    expect(tracks[0].bpm).toBe(138);
    expect(tracks[0].key).toBe("Fm");
    expect(tracks[1].title).toBe("Ectima - Python");
  });

  it("strips BOM character from header", () => {
    const txt = "\uFEFF#\tTrack Title\tKey\tBPM\n1\tTest Song\tAm\t128";
    const tracks = parseTxt(txt);
    expect(tracks).toHaveLength(1);
    expect(tracks[0].title).toBe("Test Song");
  });

  it("handles empty lines", () => {
    const txt = "Track Title\tKey\tBPM\n\nSong A\tAm\t128\n\nSong B\tDm\t135\n";
    const tracks = parseTxt(txt);
    expect(tracks).toHaveLength(2);
  });

  it("returns empty for header-only", () => {
    const txt = "Track Title\tKey\tBPM";
    expect(parseTxt(txt)).toHaveLength(0);
  });
});

describe("decodeTxtBuffer", () => {
  it("decodes UTF-8 buffer", () => {
    const text = "Hello World";
    const encoder = new TextEncoder();
    const buffer = encoder.encode(text).buffer;
    expect(decodeTxtBuffer(buffer)).toBe("Hello World");
  });

  it("detects and decodes UTF-16LE BOM", () => {
    // UTF-16LE BOM: FF FE
    const content = "Hi";
    const utf16le = new Uint8Array([
      0xff, 0xfe, // BOM
      0x48, 0x00, // H
      0x69, 0x00, // i
    ]);
    const result = decodeTxtBuffer(utf16le.buffer);
    expect(result).toContain("Hi");
  });

  it("detects and decodes UTF-16BE BOM", () => {
    const utf16be = new Uint8Array([
      0xfe, 0xff, // BOM
      0x00, 0x48, // H
      0x00, 0x69, // i
    ]);
    const result = decodeTxtBuffer(utf16be.buffer);
    expect(result).toContain("Hi");
  });
});
