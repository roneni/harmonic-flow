import type { Track } from "@/lib/types";
import { matchColumns, rowToTrack } from "./column-matcher";

/**
 * Parses a tab-delimited TXT file into Track objects.
 * Handles UTF-16LE BOM encoding (common in Rekordbox TXT exports).
 */
export function parseTxt(text: string): Track[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];

  // Strip any BOM character that may remain after TextDecoder
  let headerLine = lines[0];
  if (headerLine.charCodeAt(0) === 0xfeff) {
    headerLine = headerLine.slice(1);
  }

  const headers = headerLine.split("\t");
  const columns = matchColumns(headers);

  if (columns.key === -1) return [];
  if (columns.title === -1 && columns.artist === -1) return [];

  const tracks: Track[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split("\t");
    const track = rowToTrack(row, columns);
    if (track) tracks.push(track);
  }

  return tracks;
}

/**
 * Decodes a raw ArrayBuffer to string, detecting UTF-16LE BOM.
 * Rekordbox TXT exports are typically UTF-16LE.
 */
export function decodeTxtBuffer(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);

  // Check for UTF-16LE BOM (0xFF 0xFE)
  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xfe) {
    return new TextDecoder("utf-16le").decode(buffer);
  }

  // Check for UTF-16BE BOM (0xFE 0xFF)
  if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) {
    return new TextDecoder("utf-16be").decode(buffer);
  }

  // Default to UTF-8
  return new TextDecoder("utf-8").decode(buffer);
}
