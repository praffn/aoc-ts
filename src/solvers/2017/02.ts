import { combinations } from "../../lib/iter";
import { createSolver } from "../../solution";

function divides(a: number, b: number) {
  return a % b === 0 || b % a === 0;
}

export default createSolver(async (input) => {
  let first = 0;
  let second = 0;

  for await (const line of input) {
    const ns = line.split("\t").map((n) => parseInt(n));

    const max = Math.max(...ns);
    const min = Math.min(...ns);
    first += max - min;

    for (const [a, b] of combinations(ns, 2)) {
      if (divides(a, b)) {
        second += Math.max(a, b) / Math.min(a, b);
        break;
      }
    }
  }

  return {
    first,
    second,
  };
});
