import { Grid2D } from "../../lib/grid/grid2d";
import { count } from "../../lib/iter";
import { allDirections } from "../../lib/linalg/vec2";
import { createSolverWithLineArray } from "../../solution";

/**
 * Returns the number of directly adjacent neighbors that are occupied
 */
function getSimpleNeighborCount(grid: Grid2D<string>, x: number, y: number) {
  return count(grid.neighborsWithDiagonals(x, y, (v) => v === "#"));
}

/**
 * Returns the number of neighbors that are occupied in the first line of sight
 * in each direction.
 */
function getExtendedNeighborCount(grid: Grid2D<string>, x: number, y: number) {
  let count = 0;
  for (const { x: dx, y: dy } of allDirections) {
    let ox = x;
    let oy = y;
    while (true) {
      ox += dx;
      oy += dy;

      if (!grid.isValidPosition(ox, oy)) {
        break;
      }

      const c = grid.at(ox, oy);
      if (c === "#") {
        count++;
        break;
      }
      if (c === "L") {
        break;
      }
    }
  }
  return count;
}

/**
 * Runs a single step of the simulation with the given neighbor count function
 * Threshold is the number of neighbors that need to be occupied for a seat to
 * become empty.
 */
function step(
  grid: Grid2D<string>,
  getNeighborCount: (grid: Grid2D<string>, x: number, y: number) => number,
  threshold: number
) {
  const newGrid = new Grid2D<string>(grid.width, grid.height, ".");

  for (const [c, x, y] of grid) {
    if (c === ".") {
      continue;
    }

    const neighbors = getNeighborCount(grid, x, y);
    if (c === "L" && neighbors === 0) {
      newGrid.set(x, y, "#");
    } else if (c === "#" && neighbors >= threshold) {
      newGrid.set(x, y, "L");
    } else {
      newGrid.set(x, y, c);
    }
  }

  return newGrid;
}

/**
 * Runs the step function until the grid stabilizes and returns the number of
 * occupied seats.
 */
function solve(
  grid: Grid2D<string>,
  getNeighborCount: (grid: Grid2D<string>, x: number, y: number) => number,
  threshold: number
) {
  const seen = new Set<string>();
  while (true) {
    const key = grid.toString();
    if (seen.has(key)) {
      break;
    }

    seen.add(key);
    grid = step(grid, getNeighborCount, threshold);
  }

  return count(grid, ([v]) => v === "#");
}

export default createSolverWithLineArray(async (input) => {
  const grid = Grid2D.fromLines(input);

  return {
    first: solve(grid, getSimpleNeighborCount, 4),
    second: solve(grid, getExtendedNeighborCount, 5),
  };
});
