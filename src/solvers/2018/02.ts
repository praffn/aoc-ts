import { combinations, counter } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

function solveFirst(ids: Array<string>) {
  let containsTwo = 0;
  let containsThree = 0;
  for (const id of ids) {
    const characterCount = counter(id);
    const values = new Set(characterCount.values());

    if (values.has(2)) {
      containsTwo++;
    }
    if (values.has(3)) {
      containsThree++;
    }
  }

  return containsTwo * containsThree;
}

// assume equal length
function differsByOne(a: string, b: string): boolean {
  let distance = 0;

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      distance++;
    }

    if (distance > 1) {
      return false;
    }
  }

  return true;
}

function solveSecond(ids: Array<string>) {
  for (const [a, b] of combinations(ids, 2)) {
    if (differsByOne(a, b)) {
      return a
        .split("")
        .filter((c, i) => c === b[i])
        .join("");
    }
  }

  throw new Error("No solution found");
}

export default createSolverWithLineArray(async (input) => {
  return {
    first: solveFirst(input),
    second: solveSecond(input),
  };
});
