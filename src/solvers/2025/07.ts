import { StructuralMap } from "../../lib/collections/structural-map";
import { createSolverWithLineArray } from "../../solution";

interface ParseResult {
  allSplitters: Array<Set<number>>;
  startX: number;
  width: number;
}

/**
 * Returns:
 *
 * - an array of sets of splitters. Each index in the array corresponds to
 * a row in the grid, and each member of the set corresponds to the x-coordinate
 * of a splitter in that row.
 *
 * - the x-coordinate of the starting position of the beam
 *
 * - the max width of the grid
 */
function parse(input: Array<string>): ParseResult {
  const top = input[0];
  const rest = input.slice(1);
  const width = top.length;

  const startX = top.indexOf("S");

  const allSplitters = rest.map((line) => {
    const splitters = new Set<number>();

    for (let i = 0; i < line.length; i++) {
      if (line[i] === "^") {
        splitters.add(i);
      }
    }

    return splitters;
  });

  return {
    startX,
    width,
    allSplitters,
  };
}

/**
 * Tracks the beam(s) down the grid, accumulating the score (how many times the
 * beam has split) until it reaches the bottom. Returns the final score.
 */
function solveFirst(
  currentY: number,
  currentBeams: Set<number>,
  allSplitters: Array<Set<number>>,
  maxWidth: number,
  score: number
): number {
  if (currentY >= allSplitters.length) {
    return score;
  }

  const nextBeams = new Set<number>();
  const splitters = allSplitters[currentY];

  let splits = 0;
  for (const beam of currentBeams) {
    if (splitters.has(beam)) {
      splits++;

      if (beam > 0) {
        nextBeams.add(beam - 1);
      }
      if (beam < maxWidth - 1) {
        nextBeams.add(beam + 1);
      }
    } else {
      nextBeams.add(beam);
    }
  }

  return solveFirst(
    currentY + 1,
    nextBeams,
    allSplitters,
    maxWidth,
    score + splits
  );
}

const memo = new StructuralMap<[number, number], number>(
  ([y, x]) => `${y},${x}`
);
/**
 * Tracks each individual beam down the grid, figuring out how many unique paths
 * a beam could have taken. Returns this number
 */
function solveSecond(
  currentY: number,
  currentX: number,
  allSplitters: Array<Set<number>>,
  maxWidth: number
): number {
  if (memo.has([currentY, currentX])) {
    return memo.get([currentY, currentX])!;
  }

  if (currentY >= allSplitters.length) {
    return 1;
  }

  if (currentX < 0 || currentX >= maxWidth) {
    return 0;
  }

  const splitterIndices = allSplitters[currentY];

  let result = 0;

  if (splitterIndices.has(currentX)) {
    result =
      solveSecond(currentY + 1, currentX - 1, allSplitters, maxWidth) +
      solveSecond(currentY + 1, currentX + 1, allSplitters, maxWidth);
  } else {
    result = solveSecond(currentY + 1, currentX, allSplitters, maxWidth);
  }

  memo.set([currentY, currentX], result);
  return result;
}

export default createSolverWithLineArray(async (input) => {
  const { startX, width, allSplitters } = parse(input);

  return {
    first: solveFirst(0, new Set([startX]), allSplitters, width, 0),
    second: solveSecond(0, startX, allSplitters, width),
  };
});
