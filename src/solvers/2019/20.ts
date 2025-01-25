import { PriorityQueue } from "../../lib/collections/priority-queue";
import { StructuralMap } from "../../lib/collections/structural-map";
import { StructuralSet } from "../../lib/collections/structural-set";
import {
  add,
  cardinalDirections,
  equals,
  key,
  makeVec2,
  zero,
  type Vec2,
} from "../../lib/linalg/vec2";
import { createSolverWithLineArray } from "../../solution";

// Heavily optimized and inspired by Sophiebits
// https://github.com/sophiebits/adventofcode/blob/master/2019/day20fast.py

type Maze = {
  width: number;
  height: number;
  openSpaces: StructuralSet<Vec2>;
  start: Vec2;
  goal: Vec2;
  warpmap: StructuralMap<Vec2, Vec2>;
};

function isPortal(c: string) {
  return c[0] >= "A" && c[0] <= "Z" && c[1] >= "A" && c[1] <= "Z";
}

/**
 * Returns the left, right, up and down two characters from the given position.
 */
function getCardinalPairs(input: Array<string>, x: number, y: number) {
  return [
    input[y].slice(x - 2, x),
    input[y].slice(x + 1, x + 3),
    input[y - 2][x] + input[y - 1][x],
    input[y + 1][x] + input[y + 2][x],
  ];
}

/**
 * Parses the input and returns a Maze object consisting of a set of open
 * spaces, the warp points, and the start and goal points.
 */
function parseMaze(input: Array<string>): Maze {
  const openSpaces = new StructuralSet(key);
  let start = zero;
  let goal = zero;
  const portals = new Map<string, Array<Vec2>>();

  for (let y = 2; y < input.length - 2; y++) {
    for (let x = 2; x < input[y].length - 2; x++) {
      const c = input[y][x];
      if (c !== ".") {
        continue;
      }

      openSpaces.add(makeVec2(x, y));

      // lets check if there is a portal to the left, right, up or down.
      for (const pair of getCardinalPairs(input, x, y)) {
        if (pair === "AA") {
          // portal AA is the start
          start = makeVec2(x, y);
        } else if (pair === "ZZ") {
          // portal ZZ is the goal
          goal = makeVec2(x, y);
        } else if (isPortal(pair)) {
          // otherwise it is a portal we can actually warp through
          if (!portals.has(pair)) {
            portals.set(pair, []);
          }

          portals.get(pair)!.push(makeVec2(x, y));
        }
      }
    }
  }

  // lets construct a "bi-directional" map of the warp points
  // i.e. if A -> B, then B -> A
  const warpmap = new StructuralMap<Vec2, Vec2>(key);
  for (const [_, warpPoints] of portals) {
    warpmap.set(warpPoints[0], warpPoints[1]);
    warpmap.set(warpPoints[1], warpPoints[0]);
  }

  return {
    width: input[0].length,
    height: input.length,
    openSpaces,
    start,
    goal,
    warpmap,
  };
}

/**
 * Builds a distance mapping from all points of interest (start, goal, and all
 * warp points) to all other points of interest with the distance between them.
 */
function buildDistanceMap(
  maze: Maze
): StructuralMap<Vec2, Array<[target: Vec2, distance: number]>> {
  // our points of interest are only the start, goal, and all warp points
  const pois = new StructuralSet(key, [
    maze.start,
    maze.goal,
    ...maze.warpmap.keys(),
  ]);
  const distanceMap = new StructuralMap<Vec2, Array<[Vec2, number]>>(key);

  const visited = new StructuralMap<[Vec2, Vec2], number>(
    ([a, b]) => `${key(a)}-${key(b)}`
  );

  // we enqueue all points of interest with a distance of 0 to themselves
  const pq = new PriorityQueue<[Vec2, Vec2]>();
  pq.enqueueAll(pois.values().map((p) => [[p, p], 0]));

  while (!pq.isEmpty()) {
    const [[start, point], dist] = pq.dequeueWithPriority();

    if (visited.has([start, point])) {
      continue;
    }

    // ah we have reached another point of interest. lets add it to the
    // distance map.
    if (pois.has(point)) {
      if (!distanceMap.has(start)) {
        distanceMap.set(start, []);
      }
      distanceMap.get(start)!.push([point, dist]);
    }

    visited.set([start, point], dist);

    // now just go through all cardinal directions and enqueue the next point
    // (if it is an open space)
    for (const dir of cardinalDirections) {
      const newPoint = add(point, dir);
      if (maze.openSpaces.has(newPoint)) {
        pq.enqueue([start, newPoint], dist + 1);
      }
    }
  }

  return distanceMap;
}

/**
 * Returns the shortest path from the start to the goal and the shortest path
 * from the start to the goal with the recursive depth of the warp points.
 */
function solve(maze: Maze): [first: number, second: number] {
  const distanceMap = buildDistanceMap(maze);

  let first = -1;
  let second = -1;

  const pq = new PriorityQueue<[Vec2, number]>();
  pq.enqueue([maze.start, 0], 0);

  const visited = new StructuralMap<[Vec2, number], number>(
    ([point, depth]) => {
      return `${key(point)}@${depth}`;
    }
  );

  while (!pq.isEmpty()) {
    const [[point, depth], dist] = pq.dequeueWithPriority();

    if (visited.has([point, depth])) {
      continue;
    }

    visited.set([point, depth], dist);

    if (equals(point, maze.goal)) {
      if (first === -1) {
        first = dist;
      }
      if (depth === 0 && second === -1) {
        second = dist;
      }

      if (first !== -1 && second !== -1) {
        break;
      }
    }

    if (distanceMap.has(point)) {
      // "walk" there, we already know the distance
      for (const [newPoint, newDist] of distanceMap.get(point)!) {
        pq.enqueue([newPoint, depth], dist + newDist);
      }
    }

    const warpPoint = maze.warpmap.get(point);
    if (warpPoint) {
      // awesome! we can warp there
      if (
        3 <= point.x &&
        point.x < maze.width - 3 &&
        3 <= point.y &&
        point.y < maze.height - 3
      ) {
        // outer warp point
        pq.enqueue([warpPoint, depth + 1], dist + 1);
      } else if (depth >= 1) {
        // inner warp point
        pq.enqueue([warpPoint, depth - 1], dist + 1);
      }
    }
  }

  return [first, second];
}

export default createSolverWithLineArray(async (input) => {
  const maze = parseMaze(input);
  const [first, second] = solve(maze);

  return {
    first,
    second,
  };
});
