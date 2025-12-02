import { Range } from "../../lib/range";
import { createSolverWithString } from "../../solution";

function parse(input: string) {
  const rawRanges = input.split(",");
  const ranges: Array<Range> = [];

  for (const rawRange of rawRanges) {
    const [rawStart, rawEnd] = rawRange.trim().split("-");

    ranges.push(
      Range.inclusive(Number.parseInt(rawStart), Number.parseInt(rawEnd))
    );
  }

  return ranges;
}

/**
 * Returns the number of times a number is made of repeating blocks.
 * For example:
 * - 55        => 2 (5 repeated twice)
 * - 123123    => 2 (123 repeated twice)
 * - 123123123 => 3 (123 repeated thrice)
 * - 1234      => 0 (no repeating blocks)
 *
 * Note that it will return that repeat count of the LARGEST block,
 * i.e. 7777 will return 2 (77) and NOT 4 (7)
 */
function numberRepeatCount(n: number): number {
  const str = n.toString();
  const len = str.length;

  // A block can never be larger than half the length of the number
  const maxSize = Math.floor(len / 2);

  // Go through each possible block size, starting from the largest
  for (let size = maxSize; size > 0; size--) {
    // If we have a remainder when dividing the length by the block size,
    // then the block size is not a valid block size.
    if (len % size !== 0) {
      continue;
    }

    // Now we get the block and repeat for that number of times
    const block = str.slice(0, size);
    const repeatCount = len / size;

    // And if this is equal to the original number, then we have found a match!
    if (block.repeat(repeatCount) === str) {
      return repeatCount;
    }
  }

  return 0;
}

export default createSolverWithString(async (input) => {
  const ranges = parse(input);

  let first = 0;
  let second = 0;

  for (const range of ranges) {
    for (const n of range) {
      const repeatCount = numberRepeatCount(n);

      if (repeatCount !== 0) {
        second += n;
        if (repeatCount === 2) {
          first += n;
        }
      }
    }
  }

  return {
    first,
    second,
  };
});
