import { createSolver, createSolverWithLineArray } from "../../solution";

export default createSolver(async (input) => {
  const left = [];
  const right = [];

  for await (const line of input) {
    const [l, r] = line.split("   ");
    left.push(Number.parseInt(l, 10));
    right.push(Number.parseInt(r, 10));
  }

  const leftSorted = left.toSorted();
  const rightSorted = right.toSorted();

  let first = 0;

  for (let i = 0; i < left.length; i++) {
    first += Math.abs(leftSorted[i] - rightSorted[i]);
  }

  const occurrences = new Map<number, number>();

  const leftSet = new Set(left);
  for (const l of leftSet) {
    for (const r of right) {
      if (l === r) {
        occurrences.set(l, (occurrences.get(l) ?? 0) + 1);
      }
    }
  }

  let second = 0;

  for (const l of left) {
    const count = occurrences.get(l) ?? 0;
    second += l * count;
  }

  return {
    first,
    second,
  };
});
