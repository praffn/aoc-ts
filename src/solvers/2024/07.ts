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

    if (backtrack(index + 1, currentValue + numbers[index])) {
      return true;
    }

    if (backtrack(index + 1, currentValue * numbers[index])) {
      return true;
    }

    if (withConcatenation) {
      const concatenated = parseInt(
        currentValue.toString() + numbers[index].toString()
      );
      if (backtrack(index + 1, concatenated)) {
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
