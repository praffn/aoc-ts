import { Array2D } from "../../lib/collections/array2d";
import { cardinalDirections, type Vec2 } from "../../lib/linalg/vec2";
import { createSolverWithLineArray } from "../../solution";

/**
 * Taces a line of sight in the given direction from the given position.
 * Reurns the number of trees seen, and whether the line of sight went to the
 * edge of the grid.
 */
function trace(
  grid: Array2D<number>,
  x: number,
  y: number,
  direction: Vec2
): [visible: boolean, trees: number] {
  const height = grid.get(x, y);
  let trees = 0;
  let visible = false;

  while (true) {
    x += direction.x;
    y += direction.y;

    if (!grid.isInBounds(x, y)) {
      visible = true;
      break;
    }

    trees++;
    const otherHeight = grid.get(x, y);
    if (otherHeight >= height) {
      break;
    }
  }

  return [visible, trees];
}

/**
 * Traces in all cardinal directions from the given position.
 * Returns whether any trace was visible, and the product of the visible trees
 */
function traceCardinals(
  grid: Array2D<number>,
  x: number,
  y: number
): [visible: boolean, scenicScore: number] {
  const traces = cardinalDirections.map((dir) => trace(grid, x, y, dir));
  const visible = traces.some(([visible]) => visible);
  const scenicScore = traces.reduce((acc, [, trees]) => acc * trees, 1);

  return [visible, scenicScore];
}

export default createSolverWithLineArray(async (input) => {
  const grid = new Array2D(input.map((l) => l.split("").map((n) => +n)));
  let visibleTrees = 0;
  let bestScenicScore = -1;

  for (const [x, y] of grid.coords()) {
    const [visible, scenicScore] = traceCardinals(grid, x, y);
    if (visible) {
      visibleTrees++;
    }
    bestScenicScore = Math.max(bestScenicScore, scenicScore);
  }

  return {
    first: visibleTrees,
    second: bestScenicScore,
  };
});
