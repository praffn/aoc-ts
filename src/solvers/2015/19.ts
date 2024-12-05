import { createSolver, createSolverWithLineArray } from "../../solution";

function* indicesOf(str: string, subString: string): Generator<number> {
  let i = 0;
  while (true) {
    const r = str.indexOf(subString, i);
    if (r !== -1) {
      yield r;
      i = r + 1;
    } else {
      return;
    }
  }
}

function replace(
  str: string,
  index: number,
  length: number,
  replacement: string
) {
  return str.slice(0, index) + replacement + str.slice(index + length);
}

type Replacement = { from: string; to: string };

export default createSolverWithLineArray(async (input) => {
  const replacements: Array<Replacement> = [];

  const replacementLines = input.slice(0, input.length - 2);
  const molecule = input[input.length - 1];

  for (const replacementLine of replacementLines) {
    const [from, to] = replacementLine.split(" => ");
    replacements.push({ from, to });
  }

  const candidates = new Set<string>();
  for (const { from, to } of replacements) {
    for (const i of indicesOf(molecule, from)) {
      candidates.add(replace(molecule, i, from.length, to));
    }
  }

  // part 2 is a greedy search
  // we start from the molecule and replace the longest possible replacement
  // until we reach "e"
  const replacementsByLength = replacements.toSorted((a, b) => {
    return b.to.length - a.to.length;
  });

  let x = molecule;
  let steps = 0;

  while (x !== "e") {
    for (const { from, to } of replacementsByLength) {
      for (const i of indicesOf(x, to)) {
        x = replace(x, i, to.length, from);
        steps++;
        break;
      }
    }
  }

  return {
    first: candidates.size,
    second: steps,
  };
});
