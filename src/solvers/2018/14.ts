import { createSolverWithString } from "../../solution";

function getDigits(n: number): Array<number> {
  if (n === 0) {
    return [0];
  }

  const digits = [];

  while (n > 0) {
    digits.unshift(n % 10);
    n = Math.floor(n / 10);
  }

  return digits;
}

function containsSubArray<T>(
  array: Array<T>,
  subArray: Array<T>,
  start: number
) {
  const end = array.length - subArray.length;

  for (let i = start; i <= end; i++) {
    let found = true;
    for (let j = 0; j < subArray.length; j++) {
      if (array[i + j] !== subArray[j]) {
        found = false;
        break;
      }
    }

    if (found) {
      return i;
    }
  }

  return -1;
}

export default createSolverWithString(async (input) => {
  const scores = [3, 7];
  const n = Number.parseInt(input, 10);
  const nArr = input.split("").map((n) => Number.parseInt(n, 10));

  let firstElf = 0;
  let secondElf = 1;
  let idx = -1;

  while (scores.length < n + 10 || idx === -1) {
    const firstScore = scores[firstElf];
    const secondScore = scores[secondElf];

    const newDigits = getDigits(firstScore + secondScore);
    scores.push(...newDigits);

    firstElf = (firstElf + firstScore + 1) % scores.length;
    secondElf = (secondElf + secondScore + 1) % scores.length;

    if (idx === -1) {
      idx = containsSubArray(scores, nArr, scores.length - 7);
    }
  }

  return {
    first: scores.slice(n, n + 10).join(""),
    second: idx,
  };
});
