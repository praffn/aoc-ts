import { PriorityQueue } from "../../lib/collections/priority-queue";
import { add, equals as vecEquals, type Vec2 } from "../../lib/linalg/vec2";
import { createSolverWithString } from "../../solution";

// Returns the number of bits set in n
function popcount(n: number): number {
  n = n - ((n >> 1) & 0x55555555);
  n = (n & 0x33333333) + ((n >> 2) & 0x33333333);
  return (((n + (n >> 4)) & 0xf0f0f0f) * 0x1010101) >> 24;
}

// Returns true if the given position is a wall given some designer number
function isWall({ x, y }: Vec2, designerNumber: number): boolean {
  const n = x * x + 3 * x + 2 * x * y + y + y * y + designerNumber;
  return popcount(n) % 2 === 1;
}

// Just makes a unique string for a Vec2 -- man, please give me a tuple type...
function key(v: Vec2): string {
  return `${v.x},${v.y}`;
}

const DIRECTIONS = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
];

// Returns all valid neighbors of a position
// A valid neighbor is a position that is not a wall, not visited, and within bounds
function* getNeighbors(
  position: Vec2,
  designerNumber: number,
  visited: Set<string> | Map<string, unknown>
) {
  for (const direction of DIRECTIONS) {
    const newPosition = add(position, direction);
    if (
      visited.has(key(newPosition)) ||
      newPosition.x < 0 ||
      newPosition.y < 0 ||
      isWall(newPosition, designerNumber)
    ) {
      continue;
    }

    yield newPosition;
  }
}

// Dijkstra to find shortest path to target
function findMinimalStepsToTarget(
  designerNumber: number,
  start: Vec2,
  target: Vec2
) {
  const pq = new PriorityQueue<Vec2>();
  const visited = new Set<string>();
  pq.enqueue(start, 0);

  while (!pq.isEmpty()) {
    const [position, score] = pq.dequeueWithPriority();

    if (vecEquals(position, target)) {
      return score;
    }

    for (const neighbor of getNeighbors(position, designerNumber, visited)) {
      pq.enqueue(neighbor, score + 1);
    }

    visited.add(key(position));
  }

  throw new Error("No path found");
}

// BFS with depth limit to find all unique coordinates reachable within 50 steps
function findUniqueCoordinates(designerNumber: number, startPosition: Vec2) {
  const visited = new Map<string, number>();
  visited.set(key(startPosition), 0);
  const queue = [startPosition];

  while (queue.length !== 0) {
    const currentPosition = queue.shift()!;
    const currentKey = key(currentPosition);
    const depth = visited.get(currentKey)!;

    if (depth >= 50) {
      break;
    }

    for (const neighbor of getNeighbors(
      currentPosition,
      designerNumber,
      visited
    )) {
      visited.set(key(neighbor), depth + 1);
      queue.push(neighbor);
    }
  }

  return visited.size;
}

export default createSolverWithString(async (input) => {
  const inputNumber = Number.parseInt(input, 10);

  return {
    first: findMinimalStepsToTarget(
      inputNumber,
      { x: 1, y: 1 },
      { x: 31, y: 39 }
    ),
    second: findUniqueCoordinates(inputNumber, { x: 1, y: 1 }),
  };
});
