import { createSolverWithNumberArray } from "../../solution";

/**
 * Returns true if the number at the given index is a valid number
 *
 * A number is valid if any pair of preceding numbers (at max preambleSize
 * before the given index) sum up to the number at the given index.
 */
function isValidNumber(
  stream: Array<number>,
  index: number,
  preambleSize = 25
) {
  const n = stream[index];
  for (let i = index - preambleSize; i < stream.length; i++) {
    for (let j = i + 1; j < stream.length; j++) {
      if (stream[i] + stream[j] === n) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Returns the first number in the stream that is not a valid number
 */
function findFirstInvalidNumber(stream: Array<number>, preambleSize = 25) {
  for (let i = preambleSize; i < stream.length; i++) {
    if (!isValidNumber(stream, i, preambleSize)) {
      return stream[i];
    }
  }

  throw new Error("No invalid number found");
}

/**
 * Returns the encryption weakness in the stream given some target number
 *
 * The encryption weakness in the stream sum of the lowest and highest number
 * in a contiguous range of numbers that sum up to the target number.
 */
function findEncryptionWeakness(stream: Array<number>, target: number) {
  const prefixSum = new Map<number, number>();
  let cummulativeSum = 0;

  for (let i = 0; i < stream.length; i++) {
    prefixSum.set(cummulativeSum, i);
    cummulativeSum += stream[i];
    if (prefixSum.has(cummulativeSum - target)) {
      const lo = prefixSum.get(cummulativeSum - target)!;
      const hi = i;
      const values = stream.slice(lo, hi + 1);
      return Math.min(...values) + Math.max(...values);
    }
  }

  throw new Error("No encryption weakness found");
}

export default createSolverWithNumberArray(
  async (input, _, preambleSize = 25) => {
    const firstInvalid = findFirstInvalidNumber(input, preambleSize);
    const encryptionWeakness = findEncryptionWeakness(input, firstInvalid);

    return {
      first: firstInvalid,
      second: encryptionWeakness,
    };
  }
);
