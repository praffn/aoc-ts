import { divisors } from "../../lib/iter";
import { createSolverWithString } from "../../solution";

function calculatePresentsAtHousePart(housenumber: number): [number, number] {
  let presents1 = 0;
  let presents2 = 0;

  for (const divisor of divisors(housenumber)) {
    presents1 += divisor;
    if (housenumber / (divisor * 50) <= 1) {
      presents2 += divisor * 11;
    }
  }

  return [presents1 * 10, presents2];
}

export default createSolverWithString(async (input) => {
  const target = Number.parseInt(input, 10);

  let first: number | undefined = undefined;
  let second: number | undefined = undefined;

  let houseNumber = 1;
  while (first === undefined || second === undefined) {
    const [presents1, presents2] = calculatePresentsAtHousePart(houseNumber);

    if (first === undefined && presents1 >= target) {
      first = houseNumber;
    }

    if (second === undefined && presents2 >= target) {
      second = houseNumber;
    }

    houseNumber++;
  }

  return {
    first: first,
    second: second,
  };
});
