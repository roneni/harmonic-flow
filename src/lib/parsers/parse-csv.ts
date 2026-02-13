import type { Track } from "@/lib/types";
import { matchColumns, rowToTrack } from "./column-matcher";

/**
 * Parses a CSV file into Track objects.
 * Auto-detects delimiter (comma, semicolon, tab).
 * Handles quoted fields with embedded delimiters/newlines.
 */
export function parseCsv(text: string): Track[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];

  const delimiter = detectDelimiter(lines[0]);
  const headers = splitRow(lines[0], delimiter);
  const columns = matchColumns(headers);

  // Must have at least title+key or we can't work with this file
  if (columns.key === -1) return [];
  if (columns.title === -1 && columns.artist === -1) return [];

  const tracks: Track[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = splitRow(lines[i], delimiter);
    const track = rowToTrack(row, columns);
    if (track) tracks.push(track);
  }

  return tracks;
}

function detectDelimiter(headerLine: string): string {
  const counts = {
    ",": (headerLine.match(/,/g) || []).length,
    ";": (headerLine.match(/;/g) || []).length,
    "\t": (headerLine.match(/\t/g) || []).length,
  };

  if (counts["\t"] >= counts[","] && counts["\t"] >= counts[";"]) return "\t";
  if (counts[";"] > counts[","]) return ";";
  return ",";
}

/**
 * Splits a CSV row respecting quoted fields.
 */
function splitRow(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === delimiter) {
        result.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
  }

  result.push(current);
  return result;
}
