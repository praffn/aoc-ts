import { createSolverWithLineArray } from "../../solution";

type Grid = Array<Array<string>>;

type Vec2 = { x: number; y: number };

function isOutOfBounds(position: Vec2, width: number, height: number) {
  return (
    position.x < 0 ||
    position.x >= width ||
    position.y < 0 ||
    position.y >= height
  );
}

function turnRight(direction: Vec2): Vec2 {
  return { x: -direction.y, y: direction.x };
}

function move(position: Vec2, direction: Vec2): Vec2 {
  return { x: position.x + direction.x, y: position.y + direction.y };
}

// patrol will walk the grid at the given position until out of bounds or a cycle occurs
// it will return a tuple of the set of all visited cells and a boolean indicating if a cycle was found
function patrol(grid: Grid, start: Vec2): [Iterable<string>, boolean] {
  const height = grid.length;
  const width = grid[0].length;
  let guardPosition: Vec2 = start;
  let guardDirection: Vec2 = { x: 0, y: -1 };

  const visited = new Map<string, Set<string>>();

  let cyclic = false;

  while (true) {
    const coords = `${guardPosition.x},${guardPosition.y}`;
    const dirCoords = `${guardDirection.x},${guardDirection.y}`;
    const directions = visited.get(coords) || new Set<string>();

    if (directions.has(dirCoords)) {
      cyclic = true;
      break;
    }

    directions.add(`${guardDirection.x},${guardDirection.y}`);
    visited.set(coords, directions);

    let newPosition = move(guardPosition, guardDirection);

    if (isOutOfBounds(newPosition, width, height)) {
      break;
    }

    const nextCell = grid[newPosition.y][newPosition.x];

    if (nextCell === "#") {
      guardDirection = turnRight(guardDirection);
      continue;
    }

    guardPosition = newPosition;
  }

  return [visited.keys(), cyclic];
}

function findStartPosition(grid: Grid): Vec2 {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === "^") {
        return { x, y };
      }
    }
  }

  throw new Error("No start position found -- this should not happen");
}

function findObstaclesInPathCausingCycles(
  grid: Grid,
  startPosition: Vec2,
  path: Iterable<string>
): Set<string> {
  const obstaclesCausingCycles = new Set<string>();
  for (const coords of path) {
    const [x, y] = coords.split(",").map(Number);
    grid[y][x] = "#";
    const [, cyclic] = patrol(grid, startPosition);
    grid[y][x] = ".";

    if (cyclic) {
      obstaclesCausingCycles.add(`${x},${y}`);
    }
  }

  return obstaclesCausingCycles;
}

export default createSolverWithLineArray(async (input) => {
  const map = input.map((line) => line.split(""));

  const startPosition = findStartPosition(map);
  const [firstVisited] = patrol(map, startPosition);

  const allVisitedCoordinates = Array.from(firstVisited);
  const pathWithoutStartPosition = allVisitedCoordinates.slice(1);

  const obstaclesCausingCycles = findObstaclesInPathCausingCycles(
    map,
    startPosition,
    pathWithoutStartPosition
  );

  return {
    first: allVisitedCoordinates.length,
    second: obstaclesCausingCycles.size,
  };
});
