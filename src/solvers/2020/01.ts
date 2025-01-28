import { combinations } from "../../lib/iter";
import { createSolverWithNumberArray } from "../../solution";

export default createSolverWithNumberArray(async (input) => {
  let first = -1;
  for (const [a, b] of combinations(input, 2)) {
    if (a + b === 2020) {
      first = a * b;
    }
  }

  let second = -1;
  for (const [a, b, c] of combinations(input, 3)) {
    if (a + b + c === 2020) {
      second = a * b * c;
    }
  }

  return {
    first,
    second,
  };
});
