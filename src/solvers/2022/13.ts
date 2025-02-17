import { chunk, enumerate, zip } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

type Data = number | Array<Data>;

/**
 * Parses all packets into a flat array
 */
function parse(input: Array<string>): Array<Data> {
  const packets: Array<Data> = [];

  for (const line of input) {
    if (line === "") {
      continue;
    }

    packets.push(JSON.parse(line));
  }

  return packets;
}

/**
 * Recursively compares two data values. Returns a positive value if `a` is
 * less than `b`, a negative value if `a` is greater than `b`, and 0 if they
 * are equal (should not happen at the top level).
 */
function compare(a: Data, b: Data): number {
  if (typeof a === "number" && typeof b === "number") {
    return b - a;
  }

  if (typeof a === "number") {
    return compare([a], b);
  }

  if (typeof b === "number") {
    return compare(a, [b]);
  }

  for (const [aa, bb] of zip(a, b)) {
    const result = compare(aa, bb);
    if (result !== 0) {
      return result;
    }
  }

  return b.length - a.length;
}

/**
 * Return the sum of the indices (1-based) of all packets that are in the right
 * order.
 */
function findRightOrderSum(packets: Array<Data>): number {
  let sum = 0;

  for (const [i, [a, b]] of enumerate(chunk(packets, 2), 1)) {
    if (compare(a, b) > 0) {
      sum += i;
    }
  }

  return sum;
}

/**
 * Inserts the divider packets, sorts the packets and returns the product of the
 * new indices of the divider packets.
 */
function findDecoderKey(packets: Array<Data>) {
  const dividerA = [[2]];
  const dividerB = [[6]];

  packets.push(dividerA, dividerB);

  packets.sort((a, b) => compare(b, a));

  const indexA = packets.indexOf(dividerA) + 1;
  const indexB = packets.indexOf(dividerB) + 1;

  return indexA * indexB;
}

export default createSolverWithLineArray(async (input) => {
  const packets = parse(input);

  return {
    first: findRightOrderSum(packets),
    second: findDecoderKey(packets),
  };
});
