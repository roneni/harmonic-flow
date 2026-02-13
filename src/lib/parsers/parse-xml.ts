import type { Track } from "@/lib/types";

/**
 * Parses a Rekordbox XML export into Track objects.
 *
 * Rekordbox XML exports have the structure:
 * <DJ_PLAYLISTS>
 *   <COLLECTION>
 *     <TRACK TrackID="..." Name="..." Artist="..." AverageBpm="..." Tonality="..." />
 *   </COLLECTION>
 * </DJ_PLAYLISTS>
 *
 * Falls back to a more generic search if <COLLECTION> isn't found.
 */
export function parseXml(text: string): Track[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "application/xml");

  // Check for parse error
  const parseError = doc.querySelector("parsererror");
  if (parseError) return [];

  // Try Rekordbox format: COLLECTION > TRACK
  let trackElements = doc.querySelectorAll("COLLECTION > TRACK");

  // Fallback: try any TRACK elements
  if (trackElements.length === 0) {
    trackElements = doc.querySelectorAll("TRACK");
  }

  if (trackElements.length === 0) return [];

  const tracks: Track[] = [];

  for (const el of trackElements) {
    const title =
      el.getAttribute("Name") ||
      el.getAttribute("TrackName") ||
      el.getAttribute("Title") ||
      "";
    const artist =
      el.getAttribute("Artist") || el.getAttribute("Creator") || "";
    const keyRaw =
      el.getAttribute("Tonality") ||
      el.getAttribute("Key") ||
      el.getAttribute("MusicalKey") ||
      "";
    const bpmRaw =
      el.getAttribute("AverageBpm") ||
      el.getAttribute("BPM") ||
      el.getAttribute("Tempo") ||
      "";

    if (!title && !artist) continue;
    if (!keyRaw) continue;

    let bpm: number | null = null;
    if (bpmRaw) {
      const parsed = parseFloat(bpmRaw);
      if (!isNaN(parsed) && parsed > 0) {
        bpm = Math.round(parsed * 100) / 100;
      }
    }

    tracks.push({
      title: title || "Unknown Title",
      artist: artist || "Unknown Artist",
      key: keyRaw.trim(),
      bpm,
      camelotKey: null,
    });
  }

  return tracks;
}
