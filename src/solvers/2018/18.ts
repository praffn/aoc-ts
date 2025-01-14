import { Grid2D } from "../../lib/grid/grid2d";
import { range } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

const OPEN = ".";
const TREES = "|";
const LUMBERYARD = "#";

type Acre = typeof OPEN | typeof TREES | typeof LUMBERYARD;

function foo(grid: Grid2D<Acre>) {
  const newGrid = new Grid2D<Acre>(grid.width, grid.height, OPEN);

  for (const [acre, x, y] of grid) {
    const neighbors = Array.from(
      grid.neighborsWithDiagonals(x, y).map(({ value }) => value)
    );

    if (acre === OPEN) {
      const treeCount = neighbors.filter((a) => a === TREES).length;
      if (treeCount >= 3) {
        newGrid.set(x, y, TREES);
      } else {
        newGrid.set(x, y, OPEN);
      }
    } else if (acre === TREES) {
      const lumberyardCount = neighbors.filter((a) => a === LUMBERYARD).length;

      if (lumberyardCount >= 3) {
        newGrid.set(x, y, LUMBERYARD);
      } else {
        newGrid.set(x, y, TREES);
      }
    } else if (acre === LUMBERYARD) {
      // Lumberyard
      const treeCount = neighbors.filter((a) => a === TREES).length;
      const lumberyardCount = neighbors.filter((a) => a === LUMBERYARD).length;
      if (treeCount >= 1 && lumberyardCount >= 1) {
        newGrid.set(x, y, LUMBERYARD);
      } else {
        newGrid.set(x, y, OPEN);
      }
    }
  }

  return newGrid;
}

function keyGrid(grid: Grid2D<Acre>) {
  return Array.from(grid)
    .map(([acre]) => acre)
    .join("");
}

function findCycle(
  grid: Grid2D<Acre>
): [Grid2D<Acre>, from: number, period: number] {
  const seen = new Map<string, number>();

  let i = 0;
  while (true) {
    const key = keyGrid(grid);
    if (seen.has(key)) {
      const period = i - seen.get(key)!;
      return [grid, i, period];
    }
    seen.set(key, i);
    grid = foo(grid);
    i++;
  }
}

function resourceValue(grid: Grid2D<Acre>) {
  let trees = 0;
  let lumberyards = 0;
  for (const [acre] of grid) {
    if (acre === TREES) {
      trees++;
    } else if (acre === LUMBERYARD) {
      lumberyards++;
    }
  }

  return trees * lumberyards;
}

function solveFirst(grid: Grid2D<Acre>) {
  const gridAfter10Minutes = range(10).reduce((g) => foo(g), grid);

  return resourceValue(gridAfter10Minutes);
}

function solveSecond(grid: Grid2D<Acre>) {
  const [cycleGrid, from, period] = findCycle(grid);
  const remainingMinutes = (1000000000 - from) % period;
  const finalGrid = range(remainingMinutes).reduce((g) => foo(g), cycleGrid);

  return resourceValue(finalGrid);
}

export default createSolverWithLineArray(async (input) => {
  const grid = Grid2D.fromLines(input) as Grid2D<Acre>;

  return {
    first: solveFirst(grid),
    second: solveSecond(grid),
  };
});
