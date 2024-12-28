import { createSolverWithLineArray } from "../../solution";

function run(jumps: Array<number>, decrementGt3 = false) {
  let i = 0;
  let steps = 0;

  while (i >= 0 && i < jumps.length) {
    const jump = jumps[i];

    if (decrementGt3 && jump >= 3) {
      jumps[i]--;
    } else {
      jumps[i]++;
    }

    i += jump;
    steps++;
  }

  return steps;
}

export default createSolverWithLineArray(async (input) => {
  const jumps = input.map((line) => parseInt(line));

  return {
    first: run(jumps.slice()),
    second: run(jumps, true),
  };
});
