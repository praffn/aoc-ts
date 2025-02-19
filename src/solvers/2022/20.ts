import { range } from "../../lib/iter";
import { createSolverWithNumberArray } from "../../solution";

function solve(numbers: Array<number>, repeats: number) {
  // we're gonna shift around indices instead of the numbers
  const indices = numbers.map((_, i) => i);
  // we're gonna make a copy, we can iterate over while mutating the original.
  const copy = [...indices];

  for (const _ of range(repeats)) {
    for (const i of copy) {
      // do the mixing
      const j = indices.indexOf(i);
      indices.splice(j, 1);
      indices.splice((j + numbers[i]) % indices.length, 0, i);
    }
  }

  // find zero
  const zero = indices.indexOf(numbers.indexOf(0));

  // and return the sum of the three numbers that are 1000, 2000 and 3000
  // positions away from zero
  const a = numbers[indices[(zero + 1000) % numbers.length]];
  const b = numbers[indices[(zero + 2000) % numbers.length]];
  const c = numbers[indices[(zero + 3000) % numbers.length]];

  return a + b + c;
}

export default createSolverWithNumberArray(async (input) => {
  const numbers = input;

  return {
    first: solve(numbers, 1),
    second: solve(
      numbers.map((n) => n * 811589153),
      10
    ),
  };
});
