import { createSolverWithString } from "../../solution";

export default createSolverWithString(async (input) => {
  let first = 0;
  let second = 0;
  const numbers = input.split("").map((n) => parseInt(n));

  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] === numbers[(i + 1) % numbers.length]) {
      first += numbers[i];
    }

    if (numbers[i] === numbers[(i + numbers.length / 2) % numbers.length]) {
      second += numbers[i];
    }
  }

  return {
    first,
    second,
  };
});
