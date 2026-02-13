/**
 * All valid Camelot codes (used internally for distance calculations).
 * A = minor, B = major. Numbers 1-12 map to the circle of fifths.
 */
export const CAMELOT_ORDER: string[] = [
  "1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B",
  "5A", "5B", "6A", "6B", "7A", "7B", "8A", "8B",
  "9A", "9B", "10A", "10B", "11A", "11B", "12A", "12B",
];

export const CAMELOT_SET = new Set(CAMELOT_ORDER);

/**
 * Maps musical key notations to internal Camelot codes.
 * Covers: standard (Am, F#), enharmonic (Gb/F#), long-form (Bmaj, Amin),
 * and Open Key notation (1d, 1m).
 */
export const KEY_MAPPING: Record<string, string> = {
  // Standard Major Keys -> B side
  "B": "1B", "F#": "2B", "Gb": "2B", "Db": "3B", "C#": "3B",
  "Ab": "4B", "Eb": "5B", "Bb": "6B", "F": "7B", "C": "8B",
  "G": "9B", "D": "10B", "A": "11B", "E": "12B",

  // Standard Minor Keys -> A side
  "Abm": "1A", "G#m": "1A", "Ebm": "2A", "D#m": "2A",
  "Bbm": "3A", "A#m": "3A", "Fm": "4A", "Cm": "5A",
  "Gm": "6A", "Dm": "7A", "Am": "8A", "Em": "9A",
  "Bm": "10A", "F#m": "11A", "Gbm": "11A", "C#m": "12A", "Dbm": "12A",

  // Long-form notation (some DJ software)
  "Bmaj": "1B", "F#maj": "2B", "Gbmaj": "2B", "Dbmaj": "3B",
  "C#maj": "3B", "Abmaj": "4B", "Ebmaj": "5B", "Bbmaj": "6B",
  "Fmaj": "7B", "Cmaj": "8B", "Gmaj": "9B", "Dmaj": "10B",
  "Amaj": "11B", "Emaj": "12B",
  "Abmin": "1A", "G#min": "1A", "Ebmin": "2A", "D#min": "2A",
  "Bbmin": "3A", "A#min": "3A", "Fmin": "4A", "Cmin": "5A",
  "Gmin": "6A", "Dmin": "7A", "Amin": "8A", "Emin": "9A",
  "Bmin": "10A", "F#min": "11A", "Gbmin": "11A", "C#min": "12A",
  "Dbmin": "12A",

  // Open Key notation (1d=major/B, 1m=minor/A)
  "1d": "1B", "2d": "2B", "3d": "3B", "4d": "4B", "5d": "5B",
  "6d": "6B", "7d": "7B", "8d": "8B", "9d": "9B", "10d": "10B",
  "11d": "11B", "12d": "12B",
  "1m": "1A", "2m": "2A", "3m": "3A", "4m": "4A", "5m": "5A",
  "6m": "6A", "7m": "7A", "8m": "8A", "9m": "9A", "10m": "10A",
  "11m": "11A", "12m": "12A",
};

/**
 * Reverse mapping: Camelot code -> display key in standard musical notation.
 * Used when showing results to the user (we display Am, not 8A).
 */
export const CAMELOT_TO_KEY: Record<string, string> = {
  "1A": "Abm", "1B": "B", "2A": "Ebm", "2B": "F#",
  "3A": "Bbm", "3B": "Db", "4A": "Fm", "4B": "Ab",
  "5A": "Cm", "5B": "Eb", "6A": "Gm", "6B": "Bb",
  "7A": "Dm", "7B": "F", "8A": "Am", "8B": "C",
  "9A": "Em", "9B": "G", "10A": "Bm", "10B": "D",
  "11A": "F#m", "11B": "A", "12A": "C#m", "12B": "E",
};
