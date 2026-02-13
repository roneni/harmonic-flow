import { describe, it, expect } from "vitest";
import { exportRekordboxXml } from "@/lib/export/export-rekordbox-xml";
import type { Track } from "@/lib/types";

function makeTracks(overrides: Partial<Track>[] = []): Track[] {
  const defaults: Track[] = [
    {
      title: "Energy of Sound",
      artist: "Waveform",
      bpm: 140,
      key: "F#m",
      camelotKey: "11A",
    },
    {
      title: "Subconscious",
      artist: "Invisible Reality & Waveform",
      bpm: 142,
      key: "G",
      camelotKey: "9B",
    },
    {
      title: "Cold Memories",
      artist: "Waveform",
      bpm: 140,
      key: "Bbm",
      camelotKey: "3A",
    },
  ];
  return overrides.length > 0
    ? overrides.map((o, i) => ({ ...defaults[i % defaults.length], ...o }))
    : defaults;
}

describe("exportRekordboxXml", () => {
  it("produces valid XML with correct root structure", () => {
    const xml = exportRekordboxXml(makeTracks());

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<DJ_PLAYLISTS Version="1.0.0">');
    expect(xml).toContain("</DJ_PLAYLISTS>");
    expect(xml).toContain('<PRODUCT Name="HarmonySet"');
  });

  it("generates COLLECTION with correct track count", () => {
    const tracks = makeTracks();
    const xml = exportRekordboxXml(tracks);

    expect(xml).toContain(`<COLLECTION Entries="${tracks.length}">`);
    expect(xml).toContain("</COLLECTION>");
  });

  it("sets correct TrackID, Name, Artist, AverageBpm, Tonality", () => {
    const tracks = makeTracks();
    const xml = exportRekordboxXml(tracks);

    expect(xml).toContain('TrackID="1"');
    expect(xml).toContain('Name="Energy of Sound"');
    expect(xml).toContain('Artist="Waveform"');
    expect(xml).toContain('AverageBpm="140.00"');
    expect(xml).toContain('Tonality="F#m"');

    expect(xml).toContain('TrackID="2"');
    expect(xml).toContain('Name="Subconscious"');
    expect(xml).toContain('Artist="Invisible Reality &amp; Waveform"');
    expect(xml).toContain('AverageBpm="142.00"');
    expect(xml).toContain('Tonality="G"');
  });

  it("generates PLAYLISTS section with correct Key references in order", () => {
    const tracks = makeTracks();
    const xml = exportRekordboxXml(tracks);

    expect(xml).toContain("<PLAYLISTS>");
    expect(xml).toContain('Name="ROOT"');
    expect(xml).toContain(`Entries="${tracks.length}"`);
    expect(xml).toContain('<TRACK Key="1"/>');
    expect(xml).toContain('<TRACK Key="2"/>');
    expect(xml).toContain('<TRACK Key="3"/>');
    expect(xml).toContain("</PLAYLISTS>");
  });

  it("uses custom playlist name in PLAYLISTS node", () => {
    const xml = exportRekordboxXml(makeTracks(), "My Custom Set");
    expect(xml).toContain('Name="My Custom Set"');
  });

  it("uses default playlist name when not provided", () => {
    const xml = exportRekordboxXml(makeTracks());
    expect(xml).toContain('Name="HarmonySet Export"');
  });

  it("escapes XML special characters in all text fields", () => {
    const tracks = makeTracks([
      {
        title: 'Track "A" & <B>',
        artist: "DJ's 'Best' <Artist>",
        bpm: 138,
        key: "Am",
        camelotKey: "1A",
      },
    ]);
    const xml = exportRekordboxXml(tracks);

    expect(xml).toContain("Track &quot;A&quot; &amp; &lt;B&gt;");
    expect(xml).toContain("DJ&apos;s &apos;Best&apos; &lt;Artist&gt;");
  });

  it("escapes XML characters in playlist name", () => {
    const xml = exportRekordboxXml(makeTracks(), 'Set "Live" & <Raw>');
    expect(xml).toContain(
      'Name="Set &quot;Live&quot; &amp; &lt;Raw&gt;"'
    );
  });

  it("handles null BPM as 0.00", () => {
    const tracks = makeTracks([
      {
        title: "No BPM Track",
        artist: "Unknown",
        bpm: null,
        key: "Cm",
        camelotKey: "5A",
      },
    ]);
    const xml = exportRekordboxXml(tracks);

    expect(xml).toContain('AverageBpm="0.00"');
  });

  it("produces valid XML for empty tracks array", () => {
    const xml = exportRekordboxXml([]);

    expect(xml).toContain('<COLLECTION Entries="0">');
    expect(xml).toContain("</COLLECTION>");
    expect(xml).toContain('Entries="0">');
    expect(xml).toContain("</DJ_PLAYLISTS>");
    // Should not contain any TRACK elements
    expect(xml).not.toMatch(/<TRACK TrackID/);
  });

  it("handles decimal BPM values correctly", () => {
    const tracks = makeTracks([
      {
        title: "Decimal BPM",
        artist: "Test",
        bpm: 138.75,
        key: "Am",
        camelotKey: "1A",
      },
    ]);
    const xml = exportRekordboxXml(tracks);

    expect(xml).toContain('AverageBpm="138.75"');
  });

  it("preserves original key (not camelotKey) in Tonality attribute", () => {
    const tracks: Track[] = [
      {
        title: "Test",
        artist: "Artist",
        bpm: 140,
        key: "F#m",
        camelotKey: "11A",
      },
    ];
    const xml = exportRekordboxXml(tracks);

    expect(xml).toContain('Tonality="F#m"');
    expect(xml).not.toContain('Tonality="11A"');
  });

  it("TrackIDs are sequential 1-based", () => {
    const tracks = makeTracks();
    const xml = exportRekordboxXml(tracks);

    const trackIdMatches = xml.match(/TrackID="(\d+)"/g);
    expect(trackIdMatches).toHaveLength(3);
    expect(trackIdMatches![0]).toBe('TrackID="1"');
    expect(trackIdMatches![1]).toBe('TrackID="2"');
    expect(trackIdMatches![2]).toBe('TrackID="3"');
  });

  it("PLAYLISTS Key references match COLLECTION TrackIDs", () => {
    const tracks = makeTracks();
    const xml = exportRekordboxXml(tracks);

    // Extract TrackIDs from COLLECTION
    const collectionIds = [...xml.matchAll(/TrackID="(\d+)"/g)].map(
      (m) => m[1]
    );
    // Extract Keys from PLAYLISTS
    const playlistKeys = [...xml.matchAll(/<TRACK Key="(\d+)"\/>/g)].map(
      (m) => m[1]
    );

    expect(collectionIds).toEqual(playlistKeys);
  });
});
