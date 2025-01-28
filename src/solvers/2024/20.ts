import { Grid2D } from "../../lib/grid/grid2d";
import { combinations } from "../../lib/iter";
import { key, makeVec2, type Vec2 } from "../../lib/linalg/vec2";
import { createSolverWithLineArray } from "../../solution";

function manhattan(a: Vec2, b: Vec2) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

// Classic BFS to find the path from start to all other points
// We return a map of each of these points to the distance from the start
function pathWithDistances(grid: Grid2D<string>, start: Vec2) {
  const distances = new Map<Vec2, number>();
  distances.set(start, 0);
  const queue = [start];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentDistance = distances.get(current) ?? Infinity;

    visited.add(key(current));

    for (const { value, x, y } of grid.neighbors(current.x, current.y)) {
      if (value === "#") {
        continue;
      }
      const position = makeVec2(x, y);
      const positionKey = key(position);
      if (visited.has(positionKey)) {
        continue;
      }

      distances.set(position, currentDistance + 1);
      queue.push(position);
    }
  }

  return distances;
}

// We loop through each pair of the path and check if their manhattan distance
// is less than the cheatsize. If they are it means we can use that point pair
// to cheat. We are only interested in cheats that cut the total distance by minSave
function findCheatyPairs(
  distances: Map<Vec2, number>,
  cheatsize: number,
  minSave: number
): number {
  let count = 0;

  for (const [[a, aDistance], [b, bDistance]] of combinations(
    distances.entries(),
    2
  )) {
    const distance = manhattan(a, b);
    if (distance <= cheatsize && bDistance - aDistance >= distance + minSave) {
      count++;
    }
  }

  return count;
}

export default createSolverWithLineArray(async (input, _, minSave = 100) => {
  const raceTrack = Grid2D.fromLines(input);
  const startPosition = makeVec2(...raceTrack.findPosition((n) => n === "S")!);
  const distances = pathWithDistances(raceTrack, startPosition);

  return {
    first: findCheatyPairs(distances, 2, minSave),
    second: findCheatyPairs(distances, 20, minSave),
  };
});
