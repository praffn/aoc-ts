import { slidingWindow, sum } from "../../lib/iter";
import { createSolverWithNumberArray } from "../../solution";

function countIncreases(input: Array<number>, windowSize: number): number {
  let lastMeasurement = Infinity;
  let increases = 0;

  for (const measurements of slidingWindow(input, windowSize)) {
    const measurement = sum(measurements);
    if (measurement > lastMeasurement) {
      increases++;
    }
    lastMeasurement = measurement;
  }

  return increases;
}

export default createSolverWithNumberArray(async (input) => {
  return {
    first: countIncreases(input, 1),
    second: countIncreases(input, 3),
  };
});
