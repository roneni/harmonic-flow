import { CAMELOT_SET, KEY_MAPPING } from "./key-mapping";

/**
 * Converts various key formats to standard Camelot notation.
 *
 * Handles: "Am" -> "8A", "8A" -> "8A", "08A" -> "8A",
 *          "8m" -> "8A", "8d" -> "8B", "Bmaj" -> "1B", "am" -> "8A"
 */
export function standardizeKey(keyVal: unknown): string | null {
  if (typeof keyVal !== "string") return null;

  const k = keyVal.trim();
  if (!k) return null;

  // 1. Already standard Camelot (e.g. "8A", "12B")
  if (CAMELOT_SET.has(k)) return k;

  // 2. Direct dictionary lookup (e.g. "Am" -> "8A", "8m" -> "8A")
  if (k in KEY_MAPPING) return KEY_MAPPING[k];

  // 3. Handle leading zeros from some software (e.g. "08A" -> "8A")
  if (k.startsWith("0") && CAMELOT_SET.has(k.slice(1))) return k.slice(1);

  // 4. Case-insensitive fallback (e.g. "am" -> "Am" -> "8A")
  const lower = k.toLowerCase();
  for (const [mapKey, camelotVal] of Object.entries(KEY_MAPPING)) {
    if (lower === mapKey.toLowerCase()) return camelotVal;
  }

  return null;
}
