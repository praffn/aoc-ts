import { Array2D } from "../../lib/collections/array2d";
import { PriorityQueue } from "../../lib/collections/priority-queue";
import { StructuralSet } from "../../lib/collections/structural-set";
import { range, sum } from "../../lib/iter";
import {
  add,
  directions,
  equals,
  key,
  makeVec2,
  scale,
  zero,
  type Vec2,
} from "../../lib/linalg/vec2";
import { createSolverWithLineArray } from "../../solution";

function parse(input: Array<string>): Array2D<number> {
  return new Array2D(
    input.map((line) => {
      return line.split("").map((n) => +n);
    })
  );
}

/**
 * Finds the path with the minimal heat loss given the minimum and maximum
 * step constraints. Returns the total heat loss of the path.
 */
function findMinimalHeatLoss(
  grid: Array2D<number>,
  minSteps: number,
  maxSteps: number
): number {
  // Classic dijkstra setup
  // We have a set of visited positions and directions, and a priority queue
  // so that we can explore the most promising paths first
  const visited = new StructuralSet(([a, b]: [Vec2, Vec2]) => key(a) + key(b));
  const pq = new PriorityQueue<[Vec2, Vec2]>();
  const goal = makeVec2(grid.width - 1, grid.height - 1);

  // We start in top left corner going either east or south
  pq.enqueue([zero, directions.east], 0);
  pq.enqueue([zero, directions.south], 0);

  while (!pq.isEmpty()) {
    const [[position, direction], totalHeatLoss] = pq.dequeueWithPriority();

    if (equals(position, goal)) {
      // we reached our goal
      return totalHeatLoss;
    }

    if (visited.has([position, direction])) {
      continue;
    }
    visited.add([position, direction]);

    // Left and right turn
    const left = makeVec2(direction.y, direction.x);
    const right = makeVec2(-direction.y, -direction.x);

    // Lets turn left and right and go every possible step
    for (const dir of [left, right]) {
      // We're gonna accumulate some heat loss as we go. Initially we will lose
      // the heat from this position up to the minimum steps away.
      let accumulatedHeatLoss = sum(
        range(1, minSteps).map((i) => {
          const p = add(position, scale(dir, i));
          return grid.getOr(p.x, p.y, 0);
        })
      );

      // Then lets walk each step
      for (const steps of range(minSteps, maxSteps + 1)) {
        // Calculate the new position
        const newPosition = add(position, scale(dir, steps));
        // Stop if out of bounds
        if (!grid.isInBounds(newPosition.x, newPosition.y)) {
          break;
        }

        // Add the heat loss of the new position
        accumulatedHeatLoss += grid.get(newPosition.x, newPosition.y);
        // And enqueue this new position with the accumulated heat loss
        pq.enqueue([newPosition, dir], totalHeatLoss + accumulatedHeatLoss);
      }
    }
  }

  throw new Error("No solution found");
}

export default createSolverWithLineArray(async (input) => {
  const grid = parse(input);

  return {
    first: findMinimalHeatLoss(grid, 1, 3),
    second: findMinimalHeatLoss(grid, 4, 10),
  };
});
