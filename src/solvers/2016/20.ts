import { sum } from "../../lib/iter";
import { createSolver } from "../../solution";

// inclusive range
type Range = {
  start: number;
  end: number;
};

function mergeRanges(ranges: Array<Range>): Array<Range> {
  const sortedRanges = ranges.toSorted((a, b) => a.start - b.start);
  const mergedRanges: Array<Range> = [];
  let current = { ...sortedRanges[0] };

  for (const next of sortedRanges.slice(1)) {
    if (next.start <= current.end) {
      current.end = Math.max(current.end, next.end);
    } else {
      mergedRanges.push(current);
      current = { ...next };
    }
  }

  mergedRanges.push(current);

  return mergedRanges;
}

export default createSolver(async (input) => {
  const allRanges: Array<Range> = [];
  for await (const line of input) {
    const [start, end] = line.split("-").map((n) => Number.parseInt(n));
    allRanges.push({ start, end });
  }

  const mergedRanges = mergeRanges(allRanges);

  let smallestPassingValue = 0;
  for (const range of mergedRanges) {
    if (smallestPassingValue < range.start) {
      break;
    }
    smallestPassingValue = Math.max(smallestPassingValue, range.end + 1);
  }

  const totalBlocked = sum(mergedRanges.map((r) => r.end - r.start + 1));
  const total = 4294967295 + 1;
  const totalAllowed = total - totalBlocked;

  return {
    first: smallestPassingValue,
    second: totalAllowed,
  };
});
