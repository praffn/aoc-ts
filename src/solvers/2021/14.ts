import { mapDecrement, mapIncrement } from "../../lib/dicts";
import { counter, minMax, range, slidingWindow } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

/**
 * Parse the input and returns a 3-tuple of:
 * 1. A map of character counts in the template
 * 2. A map of pair counts in the template
 * 3. A map of rules to apply to the pairs
 */
function parse(
  input: Array<string>
): [Map<string, number>, Map<string, number>, Map<string, string>] {
  const template = input[0];
  const rules = new Map(
    input.slice(2).map((line) => {
      const [from, to] = line.split(" -> ");
      return [from, to];
    })
  );

  const charCounts = counter(template);
  const pairCounts = counter(
    slidingWindow(template, 2).map((pair) => pair.join(""))
  );

  return [charCounts, pairCounts, rules];
}

/**
 * Runs a single step of the polymer building simulation.
 * Instead of working an ever expanding string (which would quickly explode),
 * we're working with map of single characters and pairs of characters.
 *
 * The `charCounts` map keeps track of how many times each character is present,
 * and the `pairCounts` map keeps track of how many times each pair of
 * characters is present.
 *
 * The function modifies the maps in place.
 */
function step(
  charCounts: Map<string, number>,
  pairCounts: Map<string, number>,
  rules: Map<string, string>
) {
  // Lets loop through all pairs in the template and apply the pair-rule
  for (const [pair, count] of new Map(pairCounts)) {
    // If count is not positive we can skip
    if (count <= 0) {
      continue;
    }

    // Split up the pair to get the two characters
    const [a, b] = pair;
    // Since the pair has been split, we can decrement the count
    mapDecrement(pairCounts, pair, count);
    // Now lets find out which letter we should put in the middle of the pair
    const replacement = rules.get(pair)!;
    // Increment `a + x` and `x + b` in the pairCounts map
    mapIncrement(pairCounts, a + replacement, count);
    mapIncrement(pairCounts, replacement + b, count);
    // And increment the character counts for the replacement
    mapIncrement(charCounts, replacement, count);
  }
}

export default createSolverWithLineArray(async (input) => {
  const [charCounts, pairCounts, rules] = parse(input);

  // For the first part we're gonna do 10 iterations
  for (const _ of range(10)) {
    step(charCounts, pairCounts, rules);
  }
  let [min, max] = minMax(charCounts.values());
  const first = max - min;

  // And now lets do the remaining 30 iterations for a total of 40
  for (const _ of range(40 - 10)) {
    step(charCounts, pairCounts, rules);
  }
  [min, max] = minMax(charCounts.values());
  const second = max - min;

  return {
    first,
    second,
  };
});
