import { enumerate, numericProduct } from "../../lib/iter";
import { invmod, mod } from "../../lib/math";
import { createSolverWithLineArray } from "../../solution";

function minBy<T>(
  iterable: Iterable<T>,
  selector: (item: T) => number
): T | undefined {
  let min = Infinity;
  let minItem: T | undefined = undefined;
  for (const item of iterable) {
    const value = selector(item);
    if (value < min) {
      min = value;
      minItem = item;
    }
  }
  return minItem;
}

function solveFirst(busses: Array<number>, timestamp: number) {
  const validBusses = busses.filter((n) => n !== -1);
  const nextBus = minBy(validBusses, (bus) => bus - (timestamp % bus))!;
  return nextBus * (nextBus - (timestamp % nextBus));
}

function solveSecond(busses: Array<number>) {
  // Chinese remainder theorem.
  // `nas` is an array of pairs of n and a
  // we want to solve t ≡ -a_i (mod n_i) for all i
  const nas = Array.from(
    enumerate(busses)
      .filter(([_, n]) => n !== -1)
      .map(([i, n]) => [BigInt(n), BigInt(mod(-i, n))] as const)
  );

  const N = nas.reduce((a, [n]) => a * n, 1n);
  let sum = 0n;
  for (let i = 0; i < nas.length; i++) {
    const n = nas[i][0];
    const a = nas[i][1];

    const p = N / n;
    sum += a * p * invmod(p, n);
  }

  return mod(sum, N);
}

export default createSolverWithLineArray(async (input) => {
  const timestamp = Number.parseInt(input[0], 10);
  const allBusses = input[1].split(",").map((n) => {
    if (n === "x") {
      return -1;
    }
    return Number.parseInt(n, 10);
  });

  return {
    first: solveFirst(allBusses, timestamp),
    second: solveSecond(allBusses),
  };
});
