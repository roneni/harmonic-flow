import type { Track } from "@/lib/types";
import { parseCsv } from "./parse-csv";
import { parseTxt, decodeTxtBuffer } from "./parse-txt";
import { parseXml } from "./parse-xml";

export { parseCsv } from "./parse-csv";
export { parseTxt, decodeTxtBuffer } from "./parse-txt";
export { parseXml } from "./parse-xml";

/**
 * Unified file parser. Detects format from extension and parses accordingly.
 * All parsing happens client-side — no server round-trip.
 */
export async function parseFile(file: File): Promise<Track[]> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (ext === "xml") {
    const text = await file.text();
    return parseXml(text);
  }

  if (ext === "csv") {
    const text = await file.text();
    return parseCsv(text);
  }

  if (ext === "txt") {
    // TXT files may be UTF-16LE (Rekordbox), so read as ArrayBuffer first
    const buffer = await file.arrayBuffer();
    const text = decodeTxtBuffer(buffer);
    return parseTxt(text);
  }

  return [];
}
