import { add, type Vec2 } from "../../lib/linalg/vec2";
import { PriorityQueue } from "../../lib/pq";
import { createSolverWithString } from "../../solution";
import { hash } from "node:crypto";

const DIRECTIONS = [
  { x: 0, y: -1, i: 0, direction: "U" },
  { x: 0, y: 1, i: 1, direction: "D" },
  { x: -1, y: 0, i: 2, direction: "L" },
  { x: 1, y: 0, i: 3, direction: "R" },
];

function isOpen(c: string) {
  return c === "b" || c === "c" || c === "d" || c === "e" || c === "f";
}

function* getNeighbors(
  position: Vec2,
  passcode: string
): Iterable<[Vec2, string]> {
  const hashed = hash("md5", passcode);
  for (const direction of DIRECTIONS) {
    const newPosition = add(position, direction);
    // check out of bounds
    if (
      newPosition.x < 0 ||
      newPosition.y < 0 ||
      newPosition.x >= 4 ||
      newPosition.y >= 4
    ) {
      continue;
    }
    // check if door is unlocked
    if (isOpen(hashed[direction.i])) {
      yield [newPosition, passcode + direction.direction];
    }
  }
}

function solve(passcode: string): [string, number] {
  let initialPosition: Vec2 = { x: 0, y: 0 };

  const pq = new PriorityQueue<[Vec2, string]>();
  pq.enqueue([initialPosition, passcode], 0);

  const paths: Array<string> = [];

  while (!pq.isEmpty()) {
    const [[currentPosition, currentPasscode], cost] = pq.dequeueWithPriority();
    for (const [newPosition, newPasscode] of getNeighbors(
      currentPosition,
      currentPasscode
    )) {
      if (newPosition.x === 3 && newPosition.y === 3) {
        paths.push(newPasscode.slice(passcode.length));
        continue;
      }

      pq.enqueue([newPosition, newPasscode], cost + 1);
    }
  }

  return [paths[0], paths[paths.length - 1].length];
}

export default createSolverWithString(async (input) => {
  const [first, second] = solve(input);

  return {
    first,
    second,
  };
});
