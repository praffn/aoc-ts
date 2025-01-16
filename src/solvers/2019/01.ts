import { createSolver } from "../../solution";

export default createSolver(async (input) => {
  let first = 0;
  let second = 0;

  for await (const line of input) {
    const n = parseInt(line, 10);
    let fuel = Math.floor(n / 3) - 2;
    first += fuel;
    second += fuel;

    while (fuel > 0) {
      fuel = Math.floor(fuel / 3) - 2;
      if (fuel > 0) {
        second += fuel;
      }
    }
  }

  return {
    first,
    second,
  };
});
