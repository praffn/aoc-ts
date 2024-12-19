import { createSolverWithLineArray } from "../../solution";

// This is a backtracking problem.
// We have an array of possible towels, a design, and a partial design.
// Initial the design is the partial design.
// We attempt to find a towel that matches the start of the partial design.
// If we succeed, we recursively call the function with the same design and
// the rest of the partial design (ie. the partial design without the towel).
// When the partial design is empty, we have found a unique design.
// We memoize the results to avoid recalculating the same design multiple times.
const cache = new Map<string, number>();
function backtrack(towels: Array<string>, design: string, partial: string) {
  if (partial.length === 0) {
    return 1;
  }

  const key = `${design}:${partial}`;
  if (cache.has(key)) {
    return cache.get(key)!;
  }

  let total = 0;
  for (const towel of towels) {
    if (partial.indexOf(towel) === 0) {
      const next = partial.slice(towel.length);
      total += backtrack(towels, design, next);
    }
  }

  cache.set(key, total);

  return total;
}

export default createSolverWithLineArray(async (input) => {
  const towels = input[0].split(", ");
  const designs = input.slice(2);

  let possibleDesigns = 0;
  let totalUniqueDesigns = 0;
  for (const design of designs) {
    const uniqueDesigns = backtrack(towels, design, design);
    possibleDesigns += uniqueDesigns > 0 ? 1 : 0;
    totalUniqueDesigns += uniqueDesigns;
  }

  return {
    first: possibleDesigns,
    second: totalUniqueDesigns,
  };
});
