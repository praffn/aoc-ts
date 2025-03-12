import { Deque } from "../../lib/collections/deque";
import { StructuralMap } from "../../lib/collections/structural-map";
import { StructuralSet } from "../../lib/collections/structural-set";
import { count } from "../../lib/iter";
import {
  add,
  cardinalDirections,
  key,
  makeVec2,
  mod,
  zero,
  type Vec2,
} from "../../lib/linalg/vec2";
import { createSolverWithLineArray } from "../../solution";

type Garden = {
  rocks: StructuralSet<Vec2>;
  dimensions: Vec2;
};

function parse(input: Array<string>): [garden: Garden, start: Vec2] {
  const rocks = new StructuralSet(key);
  const dimensions = makeVec2(input.length, input[0].length);
  let start = zero;

  for (const [y, line] of input.entries()) {
    for (const [x, c] of line.split("").entries()) {
      if (c === "#") {
        rocks.add(makeVec2(x, y));
      } else if (c === "S") {
        start = makeVec2(x, y);
      }
    }
  }

  return [{ rocks, dimensions }, start];
}

/**
 * Walks `maxSteps` from the start point, returning a a mapping of positions and
 * their distance to the start.
 */
function computeDistanceMap(garden: Garden, start: Vec2, maxSteps: number) {
  const distanceMap = new StructuralMap<Vec2, number>(key);
  const queue = new Deque<[position: Vec2, distance: number]>();
  queue.pushBack([start, 0]);

  while (!queue.isEmpty()) {
    const [position, distance] = queue.popFront();

    if (distance > maxSteps || distanceMap.has(position)) {
      continue;
    }

    distanceMap.set(position, distance);

    for (const dir of cardinalDirections) {
      const nextPosition = add(position, dir);
      if (
        garden.rocks.has(mod(nextPosition, garden.dimensions)) ||
        distanceMap.has(nextPosition)
      ) {
        continue;
      }

      queue.pushBack([nextPosition, distance + 1]);
    }
  }

  return distanceMap;
}

export default createSolverWithLineArray(async (input) => {
  const [garden, start] = parse(input);
  const size = garden.dimensions.x;
  // lets get a distance map 3 times larger than the dimensions of the garden
  const distanceMap = computeDistanceMap(garden, start, size * 3);

  // solution to the first problem is just the number of squares that have an
  // even distance less than or equal to 64 from start.
  const first = count(distanceMap.values(), (v) => v <= 64 && v % 2 === 0);

  // For the second problem we find three values `a`, `b`, and `c` that we can
  // use to solve the quadratic equation.
  const halfSize = size >> 1;
  const n = Math.floor(26501365 / size);
  const a = count(
    distanceMap.values(),
    (v) => v <= halfSize + 0 * size && v % 2 == 1
  );
  const b = count(
    distanceMap.values(),
    (v) => v <= halfSize + 1 * size && v % 2 == 0
  );
  const c = count(
    distanceMap.values(),
    (v) => v <= halfSize + 2 * size && v % 2 == 1
  );
  const second = a + n * (b - a + ((n - 1) * (c - b - b + a)) / 2);

  return {
    first,
    second,
  };
});
