import { sum } from "../../lib/iter";
import { Range } from "../../lib/range";
import { createSolverWithString } from "../../solution";

/**
 * Returns a tuple consisting of:
 * - An array of ranges representing the fresh ingredients
 * - An array of ingredient ids
 */
function parse(input: string): [freshRanges: Array<Range>, ids: Array<number>] {
  const [rawRanges, rawIds] = input.split("\n\n");

  const freshRanges = rawRanges.split("\n").map((line) => {
    const [start, end] = line.split("-").map((n) => Number.parseInt(n));
    return Range.inclusive(start, end);
  });

  const ids = rawIds.split("\n").map((line) => Number.parseInt(line));

  return [freshRanges, ids];
}

/**
 * Given a list of ids and ranges, returns the total number of ids that are
 * contained within the ranges
 */
function findTotalFreshIngredients(
  freshRanges: Array<Range>,
  ids: Array<number>
): number {
  // We can just filter out the ids that are not contained in any range, and
  // then return the length of the resulting array
  return ids.filter((id) => {
    return freshRanges.some((range) => range.contains(id));
  }).length;
}

/**
 * Given a list of fresh ranges, returns the total number of unique ids that are
 * contained within those ranges
 */
function countUniqueFreshIds(ranges: Range[]): number {
  // Lets sort by start value to make it easier to merge ranges
  const sortedRanges = ranges.toSorted((a, b) => a.start - b.start);

  // We start with the initial range
  const merged = [sortedRanges[0]];

  // And loop through the remaining ranges
  for (const range of sortedRanges.slice(1)) {
    const last = merged[merged.length - 1];

    // If the current range overlaps or touches with the last merged range,
    // then we can merge these two ranges into a single range.
    if (last.overlaps(range) || last.touches(range)) {
      merged[merged.length - 1] = last.merge(range);
    } else {
      // Otherwise, well add the range to the merged list
      merged.push(range);
    }
  }

  // Now we know that the list of merged ranges contain NO overlapping ranges,
  // and as such we can just return the sum of the lengths of the merged ranges
  return sum(merged.map((r) => r.length()));
}

export default createSolverWithString(async (input) => {
  const [freshRanges, ids] = parse(input);

  return {
    first: findTotalFreshIngredients(freshRanges, ids),
    second: countUniqueFreshIds(freshRanges),
  };
});
