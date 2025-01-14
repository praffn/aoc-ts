import { count } from "../../lib/iter";
import { add, directions, key, makeVec2 } from "../../lib/linalg/vec2";
import { createSolverWithString } from "../../solution";

const DIRS = {
  N: directions.north,
  E: directions.east,
  S: directions.south,
  W: directions.west,
};

export default createSolverWithString(async (input) => {
  let currentPosition = makeVec2(0, 0);
  let currentDistance = 0;

  const stack = [[currentPosition, currentDistance] as const];
  const distances = new Map<string, number>();

  for (const c of input) {
    switch (c) {
      case "(":
        stack.push([currentPosition, currentDistance]);
        break;
      case ")":
        [currentPosition, currentDistance] = stack.pop()!;
        break;
      case "|":
        [currentPosition, currentDistance] = stack[stack.length - 1];
        break;
      case "N":
      case "E":
      case "S":
      case "W":
        const dir = DIRS[c];
        const newPosition = add(currentPosition, dir);
        const newPositionKey = key(newPosition);
        const distance = distances.get(newPositionKey) ?? Infinity;
        const newDistance = Math.min(distance, currentDistance + 1);
        currentPosition = newPosition;
        currentDistance = newDistance;
        distances.set(newPositionKey, newDistance);
    }
  }

  const maxDistance = Math.max(...distances.values());
  const distancesOver1000 = count(distances.values(), (d) => d >= 1000);

  return {
    first: maxDistance,
    second: distancesOver1000,
  };
});
