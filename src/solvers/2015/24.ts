import { combinations, min, numericProduct, range, sum } from "../../lib/iter";
import { createSolver } from "../../solution";

function findLowestQuantumEntanglement(
  weights: Array<number>,
  bagCount: number
) {
  // assume valid input and divisible by amount of bags
  const targetBagWeight = sum(weights) / bagCount;

  for (let i = 0; i < weights.length; i++) {
    const quantumEntanglement = min(
      combinations(weights, i)
        .filter((bag) => sum(bag) === targetBagWeight)
        .map((bag) => numericProduct(bag))
    );

    if (quantumEntanglement) {
      return quantumEntanglement;
    }
  }

  throw new Error("no solution found");
}

export default createSolver(async (input) => {
  const weights: Array<number> = [];

  for await (const line of input) {
    weights.push(Number.parseInt(line, 10));
  }

  return {
    first: findLowestQuantumEntanglement(weights, 3),
    second: findLowestQuantumEntanglement(weights, 4),
  };
});
