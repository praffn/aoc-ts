import { createSolverWithLineArray } from "../../solution";

function increment<T>(map: Map<T, number>, key: T) {
  map.set(key, (map.get(key) || 0) + 1);
}

export default createSolverWithLineArray(async (input) => {
  const counts: Array<Map<string, number>> = Array.from(
    { length: input[0].length },
    () => new Map()
  );

  for (const line of input) {
    for (let i = 0; i < line.length; i++) {
      increment(counts[i], line[i]);
    }
  }

  const sortedCounts = counts.map((count) =>
    Array.from(count.entries()).sort((a, b) => b[1] - a[1])
  );

  // get the most common letter for each column
  const first = sortedCounts.map((sorted) => sorted[0][0]).join("");
  // get the least common letter for each column
  const second = sortedCounts
    .map((sorted) => sorted[sorted.length - 1][0])
    .join("");

  return {
    first,
    second,
  };
});
