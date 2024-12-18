import { createSolverWithNumber } from "../../solution";

function closestPowerOfTwo(n: number) {
  return 2 ** Math.floor(Math.log2(n));
}

function highestPowerOfThree(n: number) {
  let power = 1;
  while (3 ** power < n) {
    power++;
  }

  return 3 ** (power - 1);
}

// I love Numberphile: https://www.youtube.com/watch?v=uCsD3ZGzMgE
function solveJosephus(n: number) {
  const closest = closestPowerOfTwo(n);
  return 2 * (n - closest) + 1;
}

// https://oeis.org/A334473
function solveNCowboys(n: number) {
  const x = highestPowerOfThree(n);
  if (x === n) {
    return n;
  }

  if (n < 2 * x) {
    return n % x;
  }

  return x + 2 * (n % x);
}

export default createSolverWithNumber(async (input) => {
  return {
    first: solveJosephus(input),
    second: solveNCowboys(input),
  };
});
