import { getCamelotDistance } from "./harmonic-distance";

/**
 * Finds the globally optimal ordering of Camelot keys using the
 * Held-Karp algorithm (dynamic programming on bitmasks).
 *
 * Solves the Shortest Hamiltonian Path problem exactly.
 * Complexity: O(2^n * n^2) where n = number of unique keys.
 *
 * Safe for n <= 20 (uses ~160MB). Falls back to greedy + 2-opt for n > 20.
 */
export function findOptimalKeyPath(uniqueKeys: string[]): string[] {
  const n = uniqueKeys.length;

  if (n <= 1) return [...uniqueKeys];
  if (n === 2) return [...uniqueKeys];

  // For large sets, fall back to greedy + 2-opt
  if (n > 20) return findGreedyWithTwoOpt(uniqueKeys);

  // Pre-compute distance matrix
  const dist: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      dist[i][j] = getCamelotDistance(uniqueKeys[i], uniqueKeys[j]);
    }
  }

  // Held-Karp DP using typed arrays for performance
  const fullMask = (1 << n) - 1;
  const tableSize = (1 << n) * n;
  const dp = new Float64Array(tableSize).fill(Infinity);
  const parent = new Int32Array(tableSize).fill(-1);

  const idx = (mask: number, node: number) => mask * n + node;

  // Base case: start at each node individually (cost 0)
  for (let i = 0; i < n; i++) {
    dp[idx(1 << i, i)] = 0;
  }

  // Fill DP table
  for (let mask = 1; mask <= fullMask; mask++) {
    for (let last = 0; last < n; last++) {
      if (!(mask & (1 << last))) continue;
      const dpVal = dp[idx(mask, last)];
      if (dpVal === Infinity) continue;

      for (let nxt = 0; nxt < n; nxt++) {
        if (mask & (1 << nxt)) continue;
        const newMask = mask | (1 << nxt);
        const newDist = dpVal + dist[last][nxt];
        const newIdx = idx(newMask, nxt);
        if (newDist < dp[newIdx]) {
          dp[newIdx] = newDist;
          parent[newIdx] = last;
        }
      }
    }
  }

  // Find the best endpoint
  let bestLast = 0;
  for (let i = 1; i < n; i++) {
    if (dp[idx(fullMask, i)] < dp[idx(fullMask, bestLast)]) {
      bestLast = i;
    }
  }

  // Backtrack to recover path
  const pathIndices: number[] = [];
  let mask = fullMask;
  let curr: number = bestLast;

  while (curr !== -1) {
    pathIndices.push(curr);
    const prev = parent[idx(mask, curr)];
    mask ^= (1 << curr);
    curr = prev;
  }

  pathIndices.reverse();
  return pathIndices.map((i) => uniqueKeys[i]);
}

/**
 * Greedy nearest-neighbor with 2-opt improvement.
 * Used as fallback for n > 20 unique keys.
 */
function findGreedyWithTwoOpt(uniqueKeys: string[]): string[] {
  const n = uniqueKeys.length;

  // Pre-compute distance matrix
  const dist: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      dist[i][j] = getCamelotDistance(uniqueKeys[i], uniqueKeys[j]);
    }
  }

  function pathDist(path: number[]): number {
    let total = 0;
    for (let i = 0; i < path.length - 1; i++) {
      total += dist[path[i]][path[i + 1]];
    }
    return total;
  }

  // Try every starting node, pick the best greedy path
  let bestPath: number[] = [];
  let bestDist = Infinity;

  for (let start = 0; start < n; start++) {
    const path = [start];
    const used = new Set([start]);

    while (path.length < n) {
      const last = path[path.length - 1];
      let bestNext = -1;
      let bestNextDist = Infinity;

      for (let j = 0; j < n; j++) {
        if (used.has(j)) continue;
        if (dist[last][j] < bestNextDist) {
          bestNextDist = dist[last][j];
          bestNext = j;
        }
      }

      path.push(bestNext);
      used.add(bestNext);
    }

    const d = pathDist(path);
    if (d < bestDist) {
      bestDist = d;
      bestPath = [...path];
    }
  }

  // 2-opt improvement
  let improved = true;
  while (improved) {
    improved = false;
    for (let i = 0; i < bestPath.length - 1; i++) {
      for (let j = i + 2; j < bestPath.length; j++) {
        const newPath = [
          ...bestPath.slice(0, i + 1),
          ...bestPath.slice(i + 1, j + 1).reverse(),
          ...bestPath.slice(j + 1),
        ];
        if (pathDist(newPath) < pathDist(bestPath)) {
          bestPath = newPath;
          improved = true;
        }
      }
    }
  }

  return bestPath.map((i) => uniqueKeys[i]);
}
