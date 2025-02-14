import { count } from "../../lib/iter";
import { Range } from "../../lib/range";
import { createSolverWithLineArray } from "../../solution";

function parse(input: Array<string>): Array<[Range, Range]> {
  const ranges: Array<[Range, Range]> = [];

  for (const line of input) {
    const [a, b] = line.split(",");
    const [aStart, aEnd] = a.split("-");
    const [bStart, bEnd] = b.split("-");

    ranges.push([
      Range.inclusive(+aStart, +aEnd),
      Range.inclusive(+bStart, +bEnd),
    ]);
  }

  return ranges;
}

export default createSolverWithLineArray(async (input) => {
  const ranges = parse(input);

  const fullyOverlappingRanges = count(ranges, ([a, b]) => {
    return a.fullyContains(b) || b.fullyContains(a);
  });

  const overlappingRanges = count(ranges, ([a, b]) => {
    return a.overlaps(b);
  });

  return {
    first: fullyOverlappingRanges,
    second: overlappingRanges,
  };
});
