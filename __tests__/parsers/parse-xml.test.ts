// @vitest-environment happy-dom
import { describe, it, expect } from "vitest";
import { parseXml } from "@/lib/parsers/parse-xml";

describe("parseXml", () => {
  it("parses standard Rekordbox XML export", () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<DJ_PLAYLISTS Version="1.0.0">
  <PRODUCT Name="rekordbox" Version="6.7.7" Company="AlphaTheta"/>
  <COLLECTION Entries="3">
    <TRACK TrackID="1" Name="Dimension" Artist="Ritmo" AverageBpm="138.00" Tonality="Am" />
    <TRACK TrackID="2" Name="Big Eyes" Artist="Motion Drive" AverageBpm="140.00" Tonality="Gm" />
    <TRACK TrackID="3" Name="Dark Silence" Artist="Reverse" AverageBpm="137.00" Tonality="Ebm" />
  </COLLECTION>
</DJ_PLAYLISTS>`;

    const tracks = parseXml(xml);
    expect(tracks).toHaveLength(3);
    expect(tracks[0].title).toBe("Dimension");
    expect(tracks[0].artist).toBe("Ritmo");
    expect(tracks[0].bpm).toBe(138);
    expect(tracks[0].key).toBe("Am");
    expect(tracks[1].title).toBe("Big Eyes");
    expect(tracks[2].key).toBe("Ebm");
  });

  it("falls back to TRACK elements without COLLECTION wrapper", () => {
    const xml = `<?xml version="1.0"?>
<playlist>
  <TRACK Name="Song A" Artist="DJ X" AverageBpm="128" Tonality="Fm" />
  <TRACK Name="Song B" Artist="DJ Y" AverageBpm="135" Tonality="Dm" />
</playlist>`;

    const tracks = parseXml(xml);
    expect(tracks).toHaveLength(2);
    expect(tracks[0].title).toBe("Song A");
  });

  it("handles alternative attribute names", () => {
    const xml = `<?xml version="1.0"?>
<data>
  <TRACK Title="Alt Title" Creator="Alt Artist" BPM="140" Key="Am" />
</data>`;

    const tracks = parseXml(xml);
    expect(tracks).toHaveLength(1);
    expect(tracks[0].title).toBe("Alt Title");
    expect(tracks[0].artist).toBe("Alt Artist");
    expect(tracks[0].bpm).toBe(140);
    expect(tracks[0].key).toBe("Am");
  });

  it("skips tracks without key", () => {
    const xml = `<?xml version="1.0"?>
<COLLECTION>
  <TRACK Name="With Key" Artist="A" AverageBpm="128" Tonality="Am" />
  <TRACK Name="No Key" Artist="B" AverageBpm="130" />
</COLLECTION>`;

    const tracks = parseXml(xml);
    expect(tracks).toHaveLength(1);
    expect(tracks[0].title).toBe("With Key");
  });

  it("handles missing BPM", () => {
    const xml = `<?xml version="1.0"?>
<COLLECTION>
  <TRACK Name="No BPM" Artist="A" Tonality="Fm" />
</COLLECTION>`;

    const tracks = parseXml(xml);
    expect(tracks).toHaveLength(1);
    expect(tracks[0].bpm).toBeNull();
  });

  it("returns empty for invalid XML", () => {
    const tracks = parseXml("not xml at all");
    expect(tracks).toHaveLength(0);
  });

  it("returns empty for XML with no tracks", () => {
    const xml = `<?xml version="1.0"?><data><item name="test"/></data>`;
    const tracks = parseXml(xml);
    expect(tracks).toHaveLength(0);
  });

  it("handles decimal BPM values", () => {
    const xml = `<?xml version="1.0"?>
<COLLECTION>
  <TRACK Name="Precise" Artist="DJ" AverageBpm="138.75" Tonality="Am" />
</COLLECTION>`;

    const tracks = parseXml(xml);
    expect(tracks[0].bpm).toBe(138.75);
  });
});
