import { Array2D } from "../../lib/collections/array2d";
import { PriorityQueue } from "../../lib/collections/priority-queue";
import { StructuralSet } from "../../lib/collections/structural-set";
import { equals, key, makeVec2, type Vec2 } from "../../lib/linalg/vec2";
import { createSolverWithLineArray } from "../../solution";

/**
 * Finds the lowest risk score path from the top-left corner to the bottom-right
 * corner of the grid. Returns that score
 */
function findLowestRiskPath(grid: Array2D<number>): number {
  // Our goal is bottom right corner
  const goal = makeVec2(grid.width - 1, grid.height - 1);

  // Setup a classic dijkstra
  const visited = new StructuralSet(key);
  const queue = new PriorityQueue<Vec2>();
  queue.enqueue(makeVec2(0, 0), 0);

  while (!queue.isEmpty()) {
    const [current, totalRisk] = queue.dequeueWithPriority();
    if (visited.has(current)) {
      continue;
    }
    visited.add(current);

    if (equals(current, goal)) {
      return totalRisk;
    }

    for (const [risk, x, y] of grid.neighbors(current.x, current.y)) {
      const next = makeVec2(x, y);
      queue.enqueue(next, totalRisk + risk);
    }
  }

  throw new Error("No path found");
}

/**
 * Grows and returns the grid by a factor of `by` in both dimensions.
 * The risk of each cell is increased by the sum of the x and y coordinates,
 * wrapping around at 9 to 1.
 */
function grow(grid: Array2D<number>, by = 5) {
  const newGrid = new Array2D<number>(grid.width * by, grid.height * by);

  for (let y = 0; y < by; y++) {
    for (let x = 0; x < by; x++) {
      for (const [risk, ix, iy] of grid.entries()) {
        const newRisk = ((risk + x + y - 1) % 9) + 1;
        newGrid.set(ix + grid.width * x, iy + grid.height * y, newRisk);
      }
    }
  }

  return newGrid;
}

export default createSolverWithLineArray(async (input) => {
  const grid = new Array2D(
    input.map((line) => line.split("").map((c) => Number.parseInt(c, 10)))
  );

  return {
    first: findLowestRiskPath(grid),
    second: findLowestRiskPath(grow(grid, 5)),
  };
});
