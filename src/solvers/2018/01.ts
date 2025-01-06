import { createSolverWithNumberArray } from "../../solution";

function findCumulativeFrequency(frequencies: Array<number>): number {
  return frequencies.reduce((acc, frequency) => acc + frequency, 0);
}

function findFirstRepeating(frequencies: Array<number>): number {
  const seen = new Set<number>();

  let frequency = 0;
  while (true) {
    for (const f of frequencies) {
      frequency += f;
      if (seen.has(frequency)) {
        return frequency;
      }
      seen.add(frequency);
    }
  }
}

export default createSolverWithNumberArray(async (input) => {
  return {
    first: findCumulativeFrequency(input),
    second: findFirstRepeating(input),
  };
});
