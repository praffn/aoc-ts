import { Grid2D } from "../../lib/grid/grid2d";
import {
  combinations,
  enumerate,
  permutations,
  range,
  slidingWindow,
  sum,
} from "../../lib/iter";
import { equals, key, makeVec2, type Vec2 } from "../../lib/linalg/vec2";
import { createSolverWithLineArray } from "../../solution";

function bfs(grid: Grid2D<string>, start: Vec2, end: Vec2) {
  const queue: Array<[Vec2, number]> = [[start, 0]];
  const visited = new Set<string>();
  visited.add(key(start));

  while (queue.length > 0) {
    const [current, steps] = queue.shift()!;
    if (equals(current, end)) {
      return steps;
    }

    for (const { value, x, y } of grid.neighbors(
      current.x,
      current.y,
      (value) => value !== "#"
    )) {
      const position = makeVec2(x, y);
      const positionKey = key(position);
      if (visited.has(positionKey)) {
        continue;
      }

      queue.push([position, steps + 1]);
      visited.add(positionKey);
    }
  }

  throw new Error("no path found");
}

function keyIndices(a: number, b: number) {
  return `${a}->${b}`;
}

export default createSolverWithLineArray(async (input) => {
  const maze = Grid2D.fromLines(input);

  const startPosition = makeVec2(...maze.findPosition((v) => v === "0")!);
  const pois = Array.from(
    maze.findAllPositions((v) => v > "0" && v <= "9")
  ).map(([x, y]) => makeVec2(x, y));

  // We calculate the distance from the start to each point of interest
  // such that startToPoiDistances[n] = distance from start -> n
  const startToPoiDistances = pois.map((x) => {
    return bfs(maze, startPosition, x);
  });

  // We now construct of a map of the distance between each pair of points
  // such that pairwiseDistanceMap[a->b] = distance from a -> b
  const pairwiseDistanceMap = new Map<string, number>();
  for (const [[aIndex, a], [bIndex, b]] of combinations(enumerate(pois), 2)) {
    const distance = bfs(maze, a, b);
    pairwiseDistanceMap.set(keyIndices(aIndex, bIndex), distance);
    pairwiseDistanceMap.set(keyIndices(bIndex, aIndex), distance);
  }

  let first = Infinity;
  let second = Infinity;
  // We need to go to all pois, so we create all permutations of the indices
  // of all pois that we can loop over
  for (const path of permutations(range(pois.length))) {
    // First we need to go from start to the first point of interest
    let distance = startToPoiDistances[path[0]];
    // Then we need to go from each point of interest to the next
    distance += sum(
      slidingWindow(path, 2).map(([a, b]) => {
        return pairwiseDistanceMap.get(keyIndices(a, b))!;
      })
    );

    // We visited all points, so let's update if we found a shorter path
    first = Math.min(distance, first);

    // For the second part we need to go back to start from the last point
    const returnDistance =
      distance + startToPoiDistances[path[path.length - 1]];
    second = Math.min(returnDistance, second);
  }

  return {
    first,
    second,
  };
});
