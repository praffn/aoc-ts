import { PriorityQueue } from "../../lib/collections/priority-queue";
import { directions } from "../../lib/linalg/vec2";
import { createSolverWithLineArray } from "../../solution";

/**
 * Returns a function that given an x and y coordinate, returns the risk level
 */
function createDynamicRiskGetter(
  targetX: number,
  targetY: number,
  depth: number
) {
  // Dynamic programming table. We extend the table by 1000 in each direction
  // because we might have to go further south/east than the target.
  // 1000 seems like a fine number to use.
  const erosionMap = Array.from({ length: targetX + 1000 }, () => {
    return Array.from({ length: targetY + 1000 }, () => -1);
  });

  function getErosion(x: number, y: number) {
    if (erosionMap[x][y] !== -1) {
      return erosionMap[x][y];
    }

    let i = 0;
    if (y === 0) {
      i = x * 16807;
    } else if (x === 0) {
      i = y * 48271;
    } else if (x === targetX && y === targetY) {
      i = 0;
    } else {
      i = getErosion(x - 1, y) * getErosion(x, y - 1);
    }

    const erosion = (i = i + depth) % 20183;
    erosionMap[x][y] = erosion;
    return erosion;
  }

  function getRisk(x: number, y: number) {
    return getErosion(x, y) % 3;
  }

  return getRisk;
}

// Stuff for the pathfinding
const NOTHING = 0;
const TORCH = 1;
const CLIMBING_GEAR = 2;
const TOOLS = [NOTHING, TORCH, CLIMBING_GEAR] as const;
type Tool = (typeof TOOLS)[number];

const DIRECTIONS = [
  directions.north,
  directions.west,
  directions.east,
  directions.south,
];

/**
 * Returns the amount of minutes the quickest path would take from 0, 0 to
 * targetX and targetX.
 */
function findQuickestPath(
  targetX: number,
  targetY: number,
  getRisk: (x: number, y: number) => number
) {
  const pq = new PriorityQueue<[x: number, y: number, tool: Tool]>();
  pq.enqueue([0, 0, TORCH], 0);
  const visited = new Map<string, number>();

  while (!pq.isEmpty()) {
    const [[x, y, tool], minutes] = pq.dequeueWithPriority();
    const key = `${x},${y},${tool}`;

    // skip if we've already visited this square with the same tool
    // and in fewer minutes
    if (visited.has(key) && visited.get(key)! <= minutes) {
      continue;
    }

    visited.set(key, minutes);

    // We've reached the target with a torch, hurray!
    if (x === targetX && y === targetY && tool === TORCH) {
      return minutes;
    }

    // First lets try to switch tools and stay in the same square
    for (const otherTool of TOOLS) {
      if (otherTool !== tool && otherTool !== getRisk(x, y)) {
        // It takes 7 minutes to switch tools
        pq.enqueue([x, y, otherTool], minutes + 7);
      }
    }

    // And now lets try to move to an adjacent squares
    for (const { x: dx, y: dy } of DIRECTIONS) {
      const nx = x + dx;
      const ny = y + dy;

      // solid rock is impassable :(
      if (nx < 0 || ny < 0) {
        continue;
      }

      // we cannot enter a square with a tool that is not allowed
      if (getRisk(nx, ny) === tool) {
        continue;
      }

      // Let's go! (it takes a minute)
      pq.enqueue([nx, ny, tool], minutes + 1);
    }
  }

  throw new Error("No path found");
}

export default createSolverWithLineArray(async (input) => {
  const depth = Number.parseInt(input[0].slice(7));
  const [targetX, targetY] = input[1]
    .slice(8)
    .split(",")
    .map((n) => Number.parseInt(n));

  const getRisk = createDynamicRiskGetter(targetX, targetY, depth);

  let totalRiskLevel = 0;
  for (let x = 0; x <= targetX; x++) {
    for (let y = 0; y <= targetY; y++) {
      totalRiskLevel += getRisk(x, y);
    }
  }

  return {
    first: totalRiskLevel,
    second: findQuickestPath(targetX, targetY, getRisk),
  };
});
