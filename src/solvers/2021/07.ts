import { range } from "../../lib/iter";
import { createSolverWithString } from "../../solution";

export default createSolverWithString(async (input) => {
  const crabs = input.split(",").map((n) => Number.parseInt(n, 10));

  // Crabs should not move `maxCrabs` or more steps
  const maxCrab = Math.max(...crabs);

  let minFuelPart1 = Infinity;
  let minFuelPart2 = Infinity;

  // Loop through 0 to `maxCrab` and figure out how much fuel it would cost to
  // move all crabs to that position. Least fuel wins.
  for (const target of range(maxCrab)) {
    let fuelPart1 = 0;
    let fuelPart2 = 0;

    for (const crab of crabs) {
      const stepsRequired = Math.abs(target - crab);

      // For part one, a single movement costs just 1 fuel
      fuelPart1 += stepsRequired;
      // For part two, the fuel required is the sum of the first `stepsRequired`
      // natural numbers. This can be calculated with the formula:
      //                                               n * (n + 1) / 2
      fuelPart2 += (stepsRequired * (stepsRequired + 1)) / 2;
    }

    minFuelPart1 = Math.min(minFuelPart1, fuelPart1);
    minFuelPart2 = Math.min(minFuelPart2, fuelPart2);
  }

  return {
    first: minFuelPart1,
    second: minFuelPart2,
  };
});
