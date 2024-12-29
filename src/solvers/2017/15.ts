import { createSolverWithLineArray } from "../../solution";

const D = 2147483647;
function* generator(seed: number, factor: number, multiple = 1) {
  // assume that multiple is always a power of 2
  const mask = multiple - 1;
  let value = seed;
  while (true) {
    value = (value * factor) % D;
    if ((value & mask) === 0) {
      yield value;
    }
  }
}

function solve(a: Iterator<number>, b: Iterator<number>, sampleSize: number) {
  let count = 0;
  while (sampleSize > 0) {
    const aVal = a.next().value!;
    const bVal = b.next().value!;
    if ((aVal & 0xffff) === (bVal & 0xffff)) {
      count++;
    }
    sampleSize--;
  }

  return count;
}

export default createSolverWithLineArray(async (input) => {
  const seedA = Number(input[0].split(" ")[4]);
  const seedB = Number(input[1].split(" ")[4]);

  return {
    first: solve(generator(seedA, 16807), generator(seedB, 48271), 40_000_000),
    second: solve(
      generator(seedA, 16807, 4),
      generator(seedB, 48271, 8),
      5_000_000
    ),
  };
});
