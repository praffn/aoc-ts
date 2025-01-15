import { getOr } from "../../lib/dicts";
import { Grid2D } from "../../lib/grid/grid2d";
import { add, makeVec2, type Vec2 } from "../../lib/linalg/vec2";
import { PriorityQueue } from "../../lib/collections/priority-queue";
import { createSolverWithLineArray } from "../../solution";

const WALL = "#";
const START = "S";
const END = "E";

const NORTH: Vec2 = makeVec2(0, -1);
const EAST: Vec2 = makeVec2(1, 0);
const SOUTH: Vec2 = makeVec2(0, 1);
const WEST: Vec2 = makeVec2(-1, 0);

const directionMap = new Map<Vec2, Array<Vec2>>([
  [NORTH, [NORTH, WEST, EAST]],
  [EAST, [EAST, NORTH, SOUTH]],
  [SOUTH, [SOUTH, EAST, WEST]],
  [WEST, [WEST, SOUTH, NORTH]],
]);

type PositionKey = string & { __brand: "PositionKey" };
type PositionAndDirectionKey = string & { __brand: "PositionAndDirectionKey" };

function keyPosition(v: Vec2) {
  return `${v.x},${v.y}` as PositionKey;
}

function keyPositionAndDirection(p: Vec2, d: Vec2) {
  return `${p.x},${p.y}:${d.x},${d.y}` as PositionAndDirectionKey;
}

function lowestPathScore(
  grid: Grid2D<string>,
  startPosition: Vec2,
  startDirection: Vec2
) {
  const pq = new PriorityQueue<{ position: Vec2; direction: Vec2 }>();
  const visited = new Set<string>();
  pq.enqueue({ position: startPosition, direction: startDirection }, 0);

  while (!pq.isEmpty()) {
    const [{ position, direction }, score] = pq.dequeueWithPriority();

    if (grid.at(position.x, position.y) === END) {
      return score;
    }

    for (const newDirection of directionMap.get(direction)!) {
      const newPosition = add(position, newDirection);

      if (
        !grid.isValidPosition(newPosition.x, newPosition.y) ||
        grid.at(newPosition.x, newPosition.y) === WALL
      ) {
        // out of bounds or hit wall
        continue;
      }

      if (visited.has(keyPosition(newPosition))) {
        continue;
      }
      const newScore = newDirection === direction ? score + 1 : score + 1001;
      pq.enqueue({ position: newPosition, direction: newDirection }, newScore);
    }

    visited.add(keyPosition(position));
  }

  return -1;
}

function getGoodSeats(
  grid: Grid2D<string>,
  startPosition: Vec2,
  startDirection: Vec2,
  bestScore: number
) {
  const seats = new Set<PositionKey>();
  const seen = new Set<PositionKey>();
  const visited = new Map<PositionAndDirectionKey, number>();
  const path = new Set<PositionKey>();

  function visit(position: Vec2, direction: Vec2, currentScore: number) {
    const pdKey = keyPositionAndDirection(position, direction);
    if (getOr(visited, pdKey, Infinity) < currentScore) {
      return;
    }
    const pKey = keyPosition(position);

    visited.set(pdKey, currentScore);
    path.add(pKey);

    if (currentScore === bestScore && grid.at(position.x, position.y) === END) {
      path.forEach((p) => seats.add(p));
    } else if (currentScore < bestScore) {
      seen.add(pKey);
      for (const newDirection of directionMap.get(direction)!) {
        const newPosition = add(position, newDirection);

        if (
          seen.has(keyPosition(newPosition)) ||
          !grid.isValidPosition(newPosition.x, newPosition.y) ||
          grid.at(newPosition.x, newPosition.y) === WALL
        ) {
          continue;
        }

        visit(
          newPosition,
          newDirection,
          currentScore + (newDirection === direction ? 1 : 1001)
        );
      }
      seen.delete(pKey);
    }
    path.delete(pKey);
  }

  visit(startPosition, startDirection, 0);

  return seats.size;
}

export default createSolverWithLineArray(async (input) => {
  const grid = Grid2D.from2DArray(input.map((l) => l.split("")));
  const [startX, startY] = grid.findPosition((t) => t === START)!;

  const firstScore = lowestPathScore(grid, makeVec2(startX, startY), EAST);

  return {
    first: firstScore,
    second: getGoodSeats(grid, makeVec2(startX, startY), EAST, firstScore),
  };
});
