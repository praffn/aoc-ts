import { createSolverWithLineArray } from "../../solution";

/**
 * Returns the largest number we can form by picking k digits from the line.
 * The k digits must be in order from left to right (but digits can be skipped).
 *
 * We do this by repeatedly picking the largest digit in a window of size
 * `k - i` where `i` is the current index of the digit we are picking. The
 * window will start at the last picked digit's index + 1, and cannot exceed
 * the length of the line minus the number of remaining digits to pick.
 */
function findLargestDigitCombination(line: string, k: number) {
  const digits = line.split("").map((n) => Number.parseInt(n, 10));
  const digitLength = digits.length;

  let result = 0;
  let lastPickedIndex = -1;

  for (let i = 0; i < k; i++) {
    const startIndex = lastPickedIndex + 1;
    const remainingDigits = k - i - 1;
    const endIndex = digitLength - remainingDigits;

    let pick = -1;
    let pickIdx = -1;

    for (let j = startIndex; j < endIndex; j++) {
      if (digits[j] > pick) {
        pick = digits[j];
        pickIdx = j;
      }
    }

    lastPickedIndex = pickIdx;
    result = result * 10 + pick;
  }

  return result;
}

export default createSolverWithLineArray(async (input) => {
  let first = 0;
  let second = 0;

  for (const line of input) {
    first += findLargestDigitCombination(line, 2);
    second += findLargestDigitCombination(line, 12);
  }

  return {
    first,
    second,
  };
});
