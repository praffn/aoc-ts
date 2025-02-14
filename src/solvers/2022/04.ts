import { count } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

type InclusiveRange = {
  start: number;
  end: number;
};

function makeInclusiveRange(start: number, end: number): InclusiveRange {
  return { start, end };
}

function rangeContainsRange(
  range: InclusiveRange,
  subRange: InclusiveRange
): boolean {
  return range.start <= subRange.start && range.end >= subRange.end;
}

function rangeOverlapsRange(a: InclusiveRange, b: InclusiveRange): boolean {
  return a.start <= b.end && a.end >= b.start;
}

function parse(input: Array<string>): Array<[InclusiveRange, InclusiveRange]> {
  const ranges: Array<[InclusiveRange, InclusiveRange]> = [];

  for (const line of input) {
    const [a, b] = line.split(",");
    const [aStart, aEnd] = a.split("-");
    const [bStart, bEnd] = b.split("-");

    ranges.push([
      makeInclusiveRange(+aStart, +aEnd),
      makeInclusiveRange(+bStart, +bEnd),
    ]);
  }

  return ranges;
}

export default createSolverWithLineArray(async (input) => {
  const ranges = parse(input);

  const fullyOverlappingRanges = count(ranges, ([a, b]) => {
    return rangeContainsRange(a, b) || rangeContainsRange(b, a);
  });

  const overlappingRanges = count(ranges, ([a, b]) => {
    return rangeOverlapsRange(a, b);
  });

  return {
    first: fullyOverlappingRanges,
    second: overlappingRanges,
  };
});
