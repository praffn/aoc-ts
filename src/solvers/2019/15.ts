import { Queue } from "../../lib/collections/queue";
import { StructuralSet } from "../../lib/collections/structural-set";
import { add, directions, key, zero, type Vec2 } from "../../lib/linalg/vec2";
import { createSolverWithString } from "../../solution";
import { IntcodeCPU } from "./intcode";

const WALL = 0;
const OXYGEN = 2;

const DIRECTIONS = [
  [1, directions.north],
  [2, directions.south],
  [3, directions.west],
  [4, directions.east],
] as const;

/**
 * Visits all reachable squares and returns a set of open squares, the position
 * of the oxygen system and the number of steps to reach it.
 */
function visitAll(cpu: IntcodeCPU): {
  openSquares: StructuralSet<Vec2>;
  oxygenPosition: Vec2;
  stepsToOxygen: number;
} {
  const openSquares = new StructuralSet(key);
  const visited = new StructuralSet(key);
  const queue = new Queue<[direction: Vec2, steps: number, cpu: IntcodeCPU]>();
  queue.enqueue([zero, 0, cpu]);

  let oxygenPosition = zero;
  let stepsToOxygen = -1;

  while (!queue.isEmpty()) {
    const [position, steps, cpu] = queue.dequeue();
    if (visited.has(position)) {
      continue;
    }

    visited.add(position);

    for (const [input, direction] of DIRECTIONS) {
      const nextPosition = add(position, direction);
      const nextCPU = cpu.clone();
      const nextSteps = steps + 1;
      nextCPU.writeInput(input);
      nextCPU.run();
      const output = nextCPU.removeFirstOutput();

      if (output === OXYGEN) {
        // we found it!
        stepsToOxygen = nextSteps;
        oxygenPosition = nextPosition;
        openSquares.add(nextPosition);
      } else if (output === WALL) {
        // wall is no-go
        visited.add(nextPosition);
      } else {
        // open square :D
        openSquares.add(nextPosition);
        queue.enqueue([nextPosition, nextSteps, nextCPU]);
      }
    }
  }

  return {
    openSquares,
    oxygenPosition,
    stepsToOxygen,
  };
}

/**
 * Given a set of open squares and the position of the oxygen system, fills all
 * open squares with oxygen and returns the number of minutes it took to fill
 */
function fillOpenSquaresWithOxygen(
  openSquares: StructuralSet<Vec2>,
  oxygenPosition: Vec2
) {
  const visited = new StructuralSet(key);
  const queue = new Queue<[Vec2, number]>();
  queue.enqueue([oxygenPosition, 0]);

  let maxMinutes = -1;
  while (!queue.isEmpty()) {
    const [position, minutes] = queue.dequeue();
    if (visited.has(position)) {
      continue;
    }

    if (!openSquares.has(position)) {
      continue;
    }

    visited.add(position);

    maxMinutes = Math.max(maxMinutes, minutes);
    for (const [, direction] of DIRECTIONS) {
      const nextPosition = add(position, direction);
      queue.enqueue([nextPosition, minutes + 1]);
    }
  }

  return maxMinutes;
}

export default createSolverWithString(async (input) => {
  const cpu = new IntcodeCPU(input);
  const { openSquares, oxygenPosition, stepsToOxygen } = visitAll(cpu);

  return {
    first: stepsToOxygen,
    second: fillOpenSquaresWithOxygen(openSquares, oxygenPosition),
  };
});
