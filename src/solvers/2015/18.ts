import { createSolverWithLineArray } from "../../solution";

type Grid = Array<Array<boolean>>;

const DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

function litNeighboursCount(grid: Grid, y: number, x: number): number {
  let count = 0;

  for (const [dy, dx] of DIRECTIONS) {
    const ny = y + dy;
    const nx = x + dx;

    if (ny < 0 || ny >= grid.length || nx < 0 || nx >= grid[ny].length) {
      continue;
    }

    count += grid[ny][nx] ? 1 : 0;
  }

  return count;
}

function step(grid: Grid, skipCorners = false): Grid {
  const newGrid = grid.map((row) => row.slice());

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (skipCorners) {
        if (
          (y === 0 && x === 0) ||
          (y === 0 && x === grid[y].length - 1) ||
          (y === grid.length - 1 && x === 0) ||
          (y === grid.length - 1 && x === grid[y].length - 1)
        ) {
          continue;
        }
      }

      const litCount = litNeighboursCount(grid, y, x);

      if (grid[y][x]) {
        newGrid[y][x] = litCount === 2 || litCount === 3;
      } else {
        newGrid[y][x] = litCount === 3;
      }
    }
  }

  return newGrid;
}

function totalLit(grid: Grid): number {
  return grid.flat().filter((x) => x).length;
}

const STEPS = 100;

export default createSolverWithLineArray(async (input) => {
  let grid: Grid = input.map((line) =>
    line.split("").map((cell) => cell === "#")
  );

  let firstGrid = grid;
  let secondGrid = grid.map((row) => row.slice());
  secondGrid[0][0] = true;
  secondGrid[0][grid[0].length - 1] = true;
  secondGrid[grid.length - 1][0] = true;
  secondGrid[grid.length - 1][grid[0].length - 1] = true;

  for (let i = 0; i < STEPS; i++) {
    firstGrid = step(firstGrid);
    secondGrid = step(secondGrid, true);
  }

  return {
    first: totalLit(firstGrid),
    second: totalLit(secondGrid),
  };
});
