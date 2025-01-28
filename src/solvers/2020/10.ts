import { slidingWindow } from "../../lib/iter";
import { createSolverWithNumberArray } from "../../solution";

/**
 * Returns the number of ways you can arrange the adapters from the given index.
 */
function countArrangements(
  adapters: Array<number>,
  index = 0,
  cache = new Map<number, number>()
): number {
  // base case: if we are at the end, there is only one way to arrange
  if (index === adapters.length - 1) {
    return 1;
  }

  // if we have already computed the result for this index, return it
  if (cache.has(index)) {
    return cache.get(index)!;
  }

  // Get counting by recursively checking the next adapters
  let count = 0;
  for (let i = index + 1; i < adapters.length; i++) {
    // if the difference is less than or equal to 3, we can connect the adapters
    if (adapters[i] - adapters[index] <= 3) {
      count += countArrangements(adapters, i, cache);
    }
  }

  cache.set(index, count);
  return count;
}

/**
 * Calculates the jolt difference between the adapters, and returns the product
 * of the number of 1-jolt differences and 3-jolt differences.
 */
function getJoltDifference(adapters: Array<number>) {
  let ones = 0;
  let threes = 0;

  for (const [a, b] of slidingWindow(adapters, 2)) {
    const diff = b - a;
    if (diff === 1) {
      ones++;
    } else if (diff === 3) {
      threes++;
    }
  }

  return ones * threes;
}

export default createSolverWithNumberArray(async (adapters) => {
  // sort adapters and add the outlet and device
  adapters.sort((a, b) => a - b);
  adapters.unshift(0);
  adapters.push(Math.max(...adapters) + 3);

  return {
    first: getJoltDifference(adapters),
    second: countArrangements(adapters),
  };
});
