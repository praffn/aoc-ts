import { Grid2D } from "../../lib/grid/grid2d";
import { count, sum } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

/**
 * Returns an array of how many rolls were removed in each iteration.
 * Stops when no more rolls can be removed.
 * A roll can be removed if it has less than 4 neighbors that are also rolls.
 *
 * This mutates the original grid.
 */
function removeRolls(grid: Grid2D<string>) {
  const removals: Array<number> = [];

  while (true) {
    const toRemove: Array<[number, number]> = [];

    for (const [c, x, y] of grid) {
      // Only consider rolls
      if (c !== "@") {
        continue;
      }

      const neighborCount = count(
        grid.neighborsWithDiagonals(x, y, (v) => v === "@")
      );

      // If the roll is removable, add it to the list of rolls to remove.
      if (neighborCount < 4) {
        toRemove.push([x, y]);
      }
    }

    // No more rolls can be removed, so we're done.
    if (toRemove.length === 0) {
      break;
    }

    // Remove the rolls.
    for (const [x, y] of toRemove) {
      grid.set(x, y, ".");
    }

    // Add the number of rolls removed to the list.
    removals.push(toRemove.length);
  }

  return removals;
}

export default createSolverWithLineArray(async (input) => {
  const grid = Grid2D.fromLines(input);

  const removals = removeRolls(grid);
  const first = removals[0];
  const second = sum(removals);

  return {
    first,
    second,
  };
});
