import { add, equals, makeVec2, key, type Vec2 } from "../../lib/linalg/vec2";
import { createSolverWithLineArray } from "../../solution";

const directions = [
  makeVec2(0, 1),
  makeVec2(0, -1),
  makeVec2(1, 0),
  makeVec2(-1, 0),
];

function isWithinBounds(p: Vec2, size: number) {
  return p.x >= 0 && p.x < size && p.y >= 0 && p.y < size;
}

function solve(size: number, bytes: Set<string>) {
  const startPosition = makeVec2(0, 0);
  const targetPosition = makeVec2(size - 1, size - 1);
  const visited = new Set<string>();
  const queue: Array<[Vec2, number]> = [[startPosition, 0]];

  while (queue.length !== 0) {
    const [currentPosition, steps] = queue.shift()!;
    visited.add(key(startPosition));

    if (equals(currentPosition, targetPosition)) {
      return steps;
    }

    for (const dir of directions) {
      const nextPosition = add(currentPosition, dir);
      const { x, y } = nextPosition;
      if (
        visited.has(key(nextPosition)) ||
        !isWithinBounds(nextPosition, size) ||
        bytes.has(key(nextPosition))
      ) {
        continue;
      }

      visited.add(key(nextPosition));
      queue.push([nextPosition, steps + 1]);
    }
  }

  return -1;
}

function solveSecond(size: number, allBytes: Array<string>) {
  const bytes = new Set<string>(allBytes);

  for (let i = allBytes.length - 1; i >= 0; i--) {
    const steps = solve(size, bytes);
    if (steps !== -1) {
      return allBytes[i + 1];
    }
    bytes.delete(allBytes[i]);
  }

  throw new Error("no solution found");
}

export default createSolverWithLineArray(async (input) => {
  const size = 71;
  const fallingBytesCount = 1024;
  const allBytes = input.map((line) => {
    const [x, y] = line.split(",").map((n) => Number.parseInt(n));
    return key(makeVec2(x, y));
  });

  return {
    first: solve(size, new Set<string>(allBytes.slice(0, fallingBytesCount))),
    second: solveSecond(size, allBytes),
  };
});
