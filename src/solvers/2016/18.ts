import { createSolverWithString } from "../../solution";

function popcount(n: bigint): bigint {
  let c = 0n;
  for (; n; c++) {
    n &= n - 1n;
  }
  return c;
}

function solve(traps: bigint, mask: bigint, rows: number) {
  let safe = 0n;
  for (let i = 0n; i < rows; i++) {
    safe += popcount(mask ^ traps);
    traps = (traps << 1n) ^ (traps >> 1n);
    traps &= mask;
  }
  return safe;
}

export default createSolverWithString(async (input) => {
  let traps = 0n;
  let mask = 0n;

  for (const c of input) {
    traps = (traps << 1n) | (c === "^" ? 1n : 0n);
    mask = (mask << 1n) | 1n;
  }

  return {
    first: solve(traps, mask, 40),
    second: solve(traps, mask, 400_000),
  };
});
