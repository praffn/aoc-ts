import { Array2D } from "../../lib/collections/array2d";
import { Deque } from "../../lib/collections/deque";
import { StructuralMap } from "../../lib/collections/structural-map";
import { count } from "../../lib/iter";
import {
  add,
  cardinalDirections,
  directions,
  equals,
  key,
  makeVec2,
  type Vec2,
} from "../../lib/linalg/vec2";
import { createSolverWithLineArray } from "../../solution";

// Big thanks to @coffee_after_sport
// My initial naive DFS implementation worked for part 1, but was simply too
// slow for part 2. The idea of bitmasking was key!

const directionToSlope = new StructuralMap<Vec2, string>(key, [
  [directions.north, "^"],
  [directions.south, "v"],
  [directions.east, ">"],
  [directions.west, "<"],
]);

/**
 * Returns true if the given position is a branch, i.e. it has more than two
 * neighbors that are not walls.
 */
function isBranch(map: Array2D<string>, x: number, y: number) {
  return count(map.neighbors(x, y).filter(([c]) => c !== "#")) > 2;
}

/**
 * Returns all points in the map that branch, including the start and goal
 * points.
 */
function branchPoints(map: Array2D<string>): Array<Vec2> {
  return Array.from(
    map
      .entries()
      .filter(
        ([c, x, y]) =>
          c !== "#" &&
          // always add start point
          (y === 0 ||
            // always add end point
            y === map.height - 1 ||
            // add branch points
            isBranch(map, x, y))
      )
      .map(([_, x, y]) => makeVec2(x, y))
  );
}

/**
 * Returns a pair of
 * - List of nodes
 * - Adjacency list mapping node indices to a list of pairs of [index of
 *   adjacent node, distance to adjacent node]
 */
function generateGraph(
  map: Array2D<string>,
  ignoreSlopes: boolean
): [Array<Vec2>, Array<Array<[number, number]>>] {
  // Lets get all "nodes" i.e. points that branch
  const nodes = branchPoints(map);

  // And create our adjacency list
  const adjacents: Array<Array<[number, number]>> = Array.from(
    { length: nodes.length },
    () => []
  );

  // Lets figure out the adjancents for every node
  for (const [startIndex, startNode] of nodes.entries()) {
    // BFS to find reachable nodes and the distance
    const queue = new Deque<
      [position: Vec2, previousPosition: Vec2, distance: number]
    >();
    queue.pushBack([startNode, startNode, 0]);

    while (!queue.isEmpty()) {
      const [position, previousPosition, distance] = queue.popFront();

      if (!equals(position, startNode)) {
        // If the current node is not the one we started at, lets check if
        // it's another branch node. If it is, we add it to the adjacency list.
        const branchIndex = nodes.findIndex((node) => equals(node, position));
        if (branchIndex !== -1) {
          adjacents[startIndex].push([branchIndex, distance]);
          continue;
        }
      }

      // Lets go in each cardinal direction
      for (const dir of cardinalDirections) {
        const next = add(position, dir);
        // continue if not in bounds
        if (!map.isInBounds(next.x, next.y)) continue;
        // we don't want to go back where we came from
        if (equals(next, previousPosition)) continue;

        const nextChar = map.get(next.x, next.y);
        // continue if wall
        if (nextChar === "#") continue;
        // if we are not ignoring slopes, and we encounter a slope that we
        // cannot traverse, we continue
        if (nextChar !== "." && !ignoreSlopes) {
          const slope = directionToSlope.get(dir)!;
          if (nextChar !== slope) continue;
        }

        // otherwise, add to queue
        queue.pushBack([next, position, distance + 1]);
      }
    }
  }

  return [nodes, adjacents];
}

/**
 * Returns the number of trailing zeros in the binary representation of the
 * given number.
 */
function trailingZeros(n: bigint) {
  let count = 0n;
  while ((n & 1n) === 0n) {
    n >>= 1n;
    count++;
  }
  return count;
}

/**
 * Returns a bitmask of all the nodes reachable from the given index.
 */
function reachable(adjacencyMasks: Array<bigint>, index: bigint, seen: bigint) {
  let queue = 1n << index;
  let reached = seen | queue;
  while (queue !== 0n) {
    const cur = trailingZeros(queue);
    queue &= ~(1n << cur);

    const mask = adjacencyMasks[Number(cur)];
    queue |= mask & ~reached;
    reached |= mask;
  }

  return reached & ~seen;
}

/**
 * Returns the longest path from the start to the target. If ignoreSlopes is
 * true we can traverse slopes that are not traversable in the other case.
 */
function findLongestPath(map: Array2D<string>, ignoreSlopes: boolean) {
  const [nodes, adjacents] = generateGraph(map, ignoreSlopes);
  const target = nodes.length - 1;
  const targetBig = BigInt(target);

  if (ignoreSlopes) {
    // optimization: at last branch before the target, we must go for the target
    const [lastBeforeTarget, cost] = adjacents[target][0];
    adjacents[lastBeforeTarget] = [[target, cost]];
  }

  // create a bitmask for each node, where each bit represents whether the node
  // at that index is reachable from the current node
  const adjacencyMasks = adjacents.map((adjacents) => {
    let mask = 0n;
    for (const [adj] of adjacents) {
      mask |= 1n << BigInt(adj);
    }
    return mask;
  });

  // bests is a map of the longest distance for some [index, reachable] pair.
  const bests = new StructuralMap<[bigint, bigint], number>(([a, b]) => {
    // `b` (reachable) is guaranteed to be less than 64 bits, so we can just
    // shift `a` by that amount. Much faster than doing string stuff to key it
    return (a << 64n) | b;
  });

  // DFS
  const stack: Array<[distance: number, nodeIndex: bigint, seen: bigint]> = [
    [0, 0n, 1n],
  ];
  // max is the longest distance found so far
  let max = 0;

  while (stack.length > 0) {
    const [cost, index, seen] = stack.pop()!;

    if (index === targetBig && cost > max) {
      // if we've reached the target with a longer path, update max
      max = cost;
      continue;
    }

    // update our reach. It we can no longer reach the target, we can skip
    // traversing this path
    const reach = reachable(adjacencyMasks, index, seen);
    if ((reach & (1n << targetBig)) === 0n) {
      continue;
    }

    // if we've already found a longer path to this node, we can skip traversing
    // this path
    const best = bests.get([index, reach]);
    if (best === undefined || cost > best) {
      bests.set([index, reach], cost);
    } else {
      continue;
    }

    // lets figure out where to go next
    const nextUp = adjacents[Number(index)]
      .filter(([adj]) => {
        return (seen & (1n << BigInt(adj))) === 0n;
      })
      .map(([adj, weight]) => {
        return [
          cost + weight,
          BigInt(adj),
          seen | (1n << BigInt(adj)),
        ] satisfies [number, bigint, bigint];
      });

    // and add to the stack
    stack.push(...nextUp);
  }

  return max;
}

export default createSolverWithLineArray(async (input) => {
  const map = new Array2D(input.map((line) => line.split("")));

  return {
    first: findLongestPath(map, false),
    second: findLongestPath(map, true),
  };
});
