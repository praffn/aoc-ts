import { Grid2D } from "../../lib/grid/grid2d";
import { add, makeVec2, type Vec2 } from "../../lib/linalg/vec2";
import { createSolver, createSolverWithLineArray } from "../../solution";

const WALL = "#";
const BOX = "O";
const ROBOT = "@";
const EMPTY = ".";
const LBOX = "[";
const RBOX = "]";

type Tile =
  | typeof WALL
  | typeof BOX
  | typeof ROBOT
  | typeof EMPTY
  | typeof LBOX
  | typeof RBOX;

function step(grid: Grid2D<Tile>, robotPosition: Vec2, direction: Vec2) {
  const newPosition = add(robotPosition, direction);
  const nextTile = grid.at(newPosition.x, newPosition.y);

  // If tile is unoccupied, move robot
  if (nextTile === EMPTY) {
    grid.set(robotPosition.x, robotPosition.y, EMPTY);
    grid.set(newPosition.x, newPosition.y, ROBOT);
    robotPosition.x = newPosition.x;
    robotPosition.y = newPosition.y;
    return;
  }

  // If next tile is a wall, do nothing
  if (nextTile === WALL) {
    return;
  }

  // Otherwise we must have some box.
  // Perform DFS to find all boxes that will move
  const boxesToMove = Array.from(
    grid.dfs(newPosition.x, newPosition.y, {
      predicate: (tile) => tile === BOX || tile === LBOX || tile === RBOX,
      getNeighbors(x, y) {
        // if we are moving in the x direction, we only want next horizontal
        if (direction.x !== 0) {
          return [makeVec2(x + direction.x, y)];
        }

        // when moving in y direction we only want neighbor above/below,
        // as well as the any connected box segment
        const neighbors = [makeVec2(x, y + direction.y)];
        const tile = grid.at(x, y);
        if (tile === LBOX) {
          neighbors.push(makeVec2(x + 1, y));
        }
        if (tile === RBOX) {
          neighbors.push(makeVec2(x - 1, y));
        }

        return neighbors;
      },
    })
  );

  // lets check if any of the boxes to move hit a wall in the direction we want
  // to move the boxes. If any of them do, we cant move
  for (const [_, x, y] of boxesToMove) {
    const nextTile = grid.at(x + direction.x, y + direction.y);
    if (nextTile === WALL) {
      return;
    }
  }

  // Alright, we can move them. Lets clear the region first
  for (const [_, x, y] of boxesToMove) {
    grid.set(x, y, EMPTY);
  }

  // And then move them
  for (const [tile, x, y] of boxesToMove) {
    grid.set(x + direction.x, y + direction.y, tile);
  }

  // Update robot position
  grid.set(robotPosition.x, robotPosition.y, EMPTY);
  grid.set(newPosition.x, newPosition.y, ROBOT);
  robotPosition.x = newPosition.x;
  robotPosition.y = newPosition.y;
}

function parseMoves(input: string): Array<Vec2> {
  return input.split("").map((c) => {
    switch (c) {
      case "^":
        return { x: 0, y: -1 };
      case "v":
        return { x: 0, y: 1 };
      case "<":
        return { x: -1, y: 0 };
      case ">":
      default:
        return { x: 1, y: 0 };
    }
  });
}

function widen(grid: Grid2D<Tile>): Grid2D<Tile> {
  const wideGrid = new Grid2D<Tile>(grid.width * 2, grid.height, EMPTY);
  for (const [tile, x, y] of grid) {
    switch (tile) {
      case WALL:
        wideGrid.set(x * 2 + 0, y, WALL);
        wideGrid.set(x * 2 + 1, y, WALL);
        break;
      case BOX:
        wideGrid.set(x * 2 + 0, y, LBOX);
        wideGrid.set(x * 2 + 1, y, RBOX);
        break;
      case EMPTY:
        wideGrid.set(x * 2 + 0, y, EMPTY);
        wideGrid.set(x * 2 + 1, y, EMPTY);
        break;
      case ROBOT:
        wideGrid.set(x * 2 + 0, y, ROBOT);
        wideGrid.set(x * 2 + 1, y, EMPTY);
        break;
    }
  }

  return wideGrid;
}

export default createSolverWithLineArray(async (input) => {
  const emptyLineIndex = input.indexOf("");
  const grid = Grid2D.from2DArray<Tile>(
    input.slice(0, emptyLineIndex).map((line) => line.split("")) as Tile[][]
  );
  const wideGrid = widen(grid);
  const moves = parseMoves(input.slice(emptyLineIndex + 1).join(""));

  // Solve first
  let robotPosition = makeVec2(...grid.findPosition((tile) => tile === ROBOT)!);
  for (const move of moves) {
    step(grid, robotPosition, move);
  }

  let first = 0;
  for (const [tile, x, y] of grid) {
    if (tile === BOX) {
      first += 100 * y + x;
    }
  }

  // Solve second
  robotPosition = makeVec2(...wideGrid.findPosition((tile) => tile === ROBOT)!);
  for (const move of moves) {
    step(wideGrid, robotPosition, move);
  }

  let second = 0;
  for (const [tile, x, y] of wideGrid) {
    if (tile === LBOX) {
      second += 100 * y + x;
    }
  }

  return {
    first,
    second,
  };
});
