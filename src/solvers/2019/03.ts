import {
  add,
  directions,
  key,
  makeVec2,
  manhattan,
  type Vec2,
} from "../../lib/linalg/vec2";
import { createSolverWithLineArray } from "../../solution";

const DIRECTIONS: Record<string, Vec2> = {
  U: directions.north,
  D: directions.south,
  L: directions.west,
  R: directions.east,
};

type WirePath = Array<{
  direction: Vec2;
  distance: number;
}>;

function parseWirePath(line: string) {
  return line.split(",").map((part) => ({
    direction: DIRECTIONS[part[0]],
    distance: parseInt(part.slice(1), 10),
  }));
}

function* walk(wire: WirePath): Generator<[Vec2, number]> {
  let currentPosition = makeVec2(0, 0);
  let steps = 1;
  for (const { direction, distance } of wire) {
    for (let i = 1; i <= distance; i++) {
      currentPosition = add(currentPosition, direction);
      yield [currentPosition, steps++];
    }
  }
}

export default createSolverWithLineArray(async (input) => {
  const firstWire = parseWirePath(input[0]);
  const secondWire = parseWirePath(input[1]);

  const centralPort = makeVec2(0, 0);

  const wireMap = new Map(
    walk(firstWire).map(([position, steps]) => [key(position), steps])
  );
  let minDistance = Infinity;
  let minSteps = Infinity;

  walk(secondWire).forEach(([position, steps]) => {
    if (wireMap.has(key(position))) {
      const distance = manhattan(centralPort, position);
      const wire1Steps = wireMap.get(key(position))!;

      minDistance = Math.min(minDistance, distance);
      minSteps = Math.min(minSteps, wire1Steps + steps);
    }
  });

  return {
    first: minDistance,
    second: minSteps,
  };
});
