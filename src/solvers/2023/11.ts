import { Array2D } from "../../lib/collections/array2d";
import { StructuralMap } from "../../lib/collections/structural-map";
import { combinations, enumerate, range } from "../../lib/iter";
import { key, makeVec2, type Vec2 } from "../../lib/linalg/vec2";
import { createSolverWithLineArray } from "../../solution";

function emptyIndices(it: IteratorObject<Array<string>>) {
  return new Set(
    enumerate(it)
      .filter(([_, cs]) => cs.every((c) => c === "."))
      .map(([i]) => i)
  );
}

/**
 * Parses the input returning:
 *
 * - An array of positions of the galaxies (unexpanded)
 * - A set of indices of rows that are empty
 * - A set of indices of columns that are empty
 */
function parse(
  input: Array<string>
): [galaxies: Array<Vec2>, emptyRows: Set<number>, emptyColumns: Set<number>] {
  const galaxies: Array<Vec2> = [];

  const grid = new Array2D(input.map((line) => line.split("")));
  const emptyRows = emptyIndices(grid.rows());
  const emptyColumns = emptyIndices(grid.columns());

  for (const [c, x, y] of grid.entries()) {
    if (c === ".") continue;
    galaxies.push(makeVec2(x, y));
  }

  return [galaxies, emptyRows, emptyColumns];
}

/**
 * Returns the sum of the lengths between all pairs of galaxies, taking into
 * account the expansion factor.
 */
function solve(
  galaxies: Array<Vec2>,
  emptyRows: Set<number>,
  emptyColumns: Set<number>,
  expansionFactor = 2
) {
  const rangeSets = new StructuralMap<Vec2, Set<number>>(key);

  let total = 0;

  // lets loop through each pair of galaxies
  for (const [a, b] of combinations(galaxies, 2)) {
    // find the min/max of each axis
    const minX = Math.min(a.x, b.x);
    const maxX = Math.max(a.x, b.x);
    const minY = Math.min(a.y, b.y);
    const maxY = Math.max(a.y, b.y);

    // Lets get the range of x's between minx and maxx
    const colRange = rangeSets.getOrDefault(makeVec2(minX, maxX), () => {
      return new Set(range(minX, maxX + 1));
    });
    // Same for miny and maxy
    const rowRange = rangeSets.getOrDefault(makeVec2(minY, maxY), () => {
      return new Set(range(minY, maxY + 1));
    });

    // we're gonna expand x and y by the number of empty rows/columns in their
    // respective ranges, multiplied by the expansion factor.
    const expansionX =
      emptyColumns.intersection(colRange).size * (expansionFactor - 1);
    const expansionY =
      emptyRows.intersection(rowRange).size * (expansionFactor - 1);

    total += maxX - minX + expansionX + (maxY - minY) + expansionY;
  }

  return total;
}

export default createSolverWithLineArray(async (input) => {
  const [galaxies, emptyRows, emptyColumns] = parse(input);

  return {
    first: solve(galaxies, emptyRows, emptyColumns),
    second: solve(galaxies, emptyRows, emptyColumns, 1e6),
  };
});
