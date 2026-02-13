import type { Track } from "@/lib/types";

/**
 * Flexible column name matching for CSV/TXT headers.
 * Handles variations like "Track Title" / "Title" / "Name",
 * "BPM" / "Tempo" / "AverageBpm", "Key" / "Tonality", etc.
 */

type ColumnRole = "title" | "artist" | "bpm" | "key";

const COLUMN_PATTERNS: Record<ColumnRole, RegExp> = {
  title: /^(track\s*title|title|name|track\s*name)$/i,
  artist: /^(artist|artist\s*name|dj)$/i,
  bpm: /^(bpm|tempo|average\s*bpm|averagebpm)$/i,
  key: /^(key|tonality|musical\s*key)$/i,
};

export interface ColumnMap {
  title: number;
  artist: number;
  bpm: number;
  key: number;
}

/**
 * Given a list of header strings, finds the column index for each role.
 * Returns -1 for any role that can't be matched.
 */
export function matchColumns(headers: string[]): ColumnMap {
  const map: ColumnMap = { title: -1, artist: -1, bpm: -1, key: -1 };

  for (let i = 0; i < headers.length; i++) {
    const h = headers[i].trim();
    for (const [role, pattern] of Object.entries(COLUMN_PATTERNS) as [
      ColumnRole,
      RegExp,
    ][]) {
      if (map[role] === -1 && pattern.test(h)) {
        map[role] = i;
      }
    }
  }

  return map;
}

/**
 * Converts a row of string values into a Track using the column map.
 */
export function rowToTrack(row: string[], columns: ColumnMap): Track | null {
  const title =
    columns.title >= 0 ? row[columns.title]?.trim() : "";
  const artist =
    columns.artist >= 0 ? row[columns.artist]?.trim() : "";
  const key = columns.key >= 0 ? row[columns.key]?.trim() : "";

  // Must have at least a title or artist
  if (!title && !artist) return null;

  // Must have a key
  if (!key) return null;

  let bpm: number | null = null;
  if (columns.bpm >= 0) {
    const raw = row[columns.bpm]?.trim();
    if (raw) {
      const parsed = parseFloat(raw);
      if (!isNaN(parsed) && parsed > 0) {
        bpm = Math.round(parsed * 100) / 100;
      }
    }
  }

  return {
    title: title || "Unknown Title",
    artist: artist || "Unknown Artist",
    key,
    bpm,
    camelotKey: null,
  };
}
