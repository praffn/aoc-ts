import { digitConcat } from "../../lib/math/math";
import { createSolver } from "../../solution";

function canBeSolved(
  numbers: ReadonlyArray<number>,
  target: number,
  withConcatenation = false
): boolean {
  if (numbers.length < 2) return false;

  function backtrack(index: number, currentValue: number): boolean {
    if (index === numbers.length) {
      return currentValue === target;
    }

    // All numbers are positive, so all operations MUST be increasing.
    // Therefore, if we overshoot early we can stop
    if (currentValue > target) {
      return false;
    }

    // Attempt addition
    if (backtrack(index + 1, currentValue + numbers[index])) {
      return true;
    }

    // Attempt subtraction
    if (backtrack(index + 1, currentValue * numbers[index])) {
      return true;
    }

    // Attempt concatenation (if enabled)
    if (withConcatenation) {
      if (backtrack(index + 1, digitConcat(currentValue, numbers[index]))) {
        return true;
      }
    }

    return false;
  }

  return backtrack(1, numbers[0]);
}

export default createSolver(async (input) => {
  let first = 0;
  let second = 0;

  for await (const line of input) {
    const [rawTarget, rawNumbers] = line.split(": ");
    const target = Number.parseInt(rawTarget, 10);
    const numbers = rawNumbers.split(" ").map((n) => Number.parseInt(n, 10));

    if (canBeSolved(numbers, target, false)) {
      first += target;
    }

    if (canBeSolved(numbers, target, true)) {
      second += target;
    }
  }

  return {
    first,
    second,
  };
});
