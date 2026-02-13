/**
 * Calculates the true harmonic distance between two Camelot keys.
 *
 * The circle of fifths has two rings (A=minor, B=major),
 * each with 12 positions arranged in a circle (1-12).
 *
 * Compatible transitions (distance 1):
 *   - Same number, switch A<->B (relative major/minor)
 *   - Same letter, adjacent number on the 1-12 circle
 *
 * Returns the minimum number of steps on the wheel.
 */
export function getCamelotDistance(
  key1: string | null,
  key2: string | null
): number {
  if (!key1 || !key2) return 100;

  const num1 = parseInt(key1.slice(0, -1), 10);
  const let1 = key1.slice(-1);
  const num2 = parseInt(key2.slice(0, -1), 10);
  const let2 = key2.slice(-1);

  // Circular distance on the 1-12 wheel
  let numDiff = Math.abs(num1 - num2);
  numDiff = Math.min(numDiff, 12 - numDiff);

  // Same number, different letter = relative major/minor (perfect mix)
  if (numDiff === 0 && let1 !== let2) return 1;

  // Same letter (both minor or both major) = just the circular step count
  if (let1 === let2) return numDiff;

  // Different letter AND different number = cross ring + steps
  return numDiff + 1;
}
