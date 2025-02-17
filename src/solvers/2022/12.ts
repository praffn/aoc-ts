import { Queue } from "../../lib/collections/queue";
import { StructuralMap } from "../../lib/collections/structural-map";
import {
  add,
  cardinalDirections,
  equals,
  key,
  makeVec2,
  zero,
  type Vec2,
} from "../../lib/linalg/vec2";
import { createSolverWithLineArray } from "../../solution";

/**
 * Parses the input into a map of positions to heights, and returns the start
 * and end position. (S and E are also turned into a height)
 */
function parse(
  input: Array<string>
): [map: StructuralMap<Vec2, number>, start: Vec2, end: Vec2] {
  const map = new StructuralMap<Vec2, number>(key);
  let start: Vec2 = zero;
  let end: Vec2 = zero;

  for (const [y, line] of input.entries()) {
    for (const [x, char] of line.split("").entries()) {
      const position = makeVec2(x, y);
      let height;
      if (char === "S") {
        start = position;
        height = 0; // <- height 'a'
      } else if (char === "E") {
        end = position;
        height = 25; // <-- height 'z'
      } else {
        height = char.charCodeAt(0) - 97; // <- c - 'a'
      }

      map.set(position, height);
    }
  }

  return [map, start, end];
}

/**
 * Returns the fewest step of any path from any of the start positions to the
 * end position.
 */
function getFewestSteps(
  map: StructuralMap<Vec2, number>,
  starts: Array<Vec2>,
  end: Vec2
) {
  // classic bfs setup with a queue and a map of distances, where we only
  // revisit a position if we can reach it in fewer steps

  const distances = new StructuralMap<Vec2, number>(key);
  const queue = new Queue<Vec2>();
  queue.enqueueAll(starts);
  starts.forEach((start) => distances.set(start, 0));

  while (!queue.isEmpty()) {
    const current = queue.dequeue();
    const currentHeight = map.get(current)!;
    const currentDistance = distances.get(current)!;

    if (equals(current, end)) {
      return currentDistance;
    }

    for (const dir of cardinalDirections) {
      const next = add(current, dir);

      if (!map.has(next)) {
        continue;
      }

      const nextHeight = map.get(next)!;

      if (currentHeight >= nextHeight - 1) {
        const nextDistance = currentDistance + 1;
        if (nextDistance < (distances.get(next) ?? Infinity)) {
          distances.set(next, nextDistance);
          queue.enqueue(next);
        }
      }
    }
  }

  throw new Error("No path found");
}

export default createSolverWithLineArray(async (input) => {
  const [map, start, end] = parse(input);
  const allElevation0Positions = map.filter((v) => v === 0).keys();

  return {
    first: getFewestSteps(map, [start], end),
    second: getFewestSteps(map, [...allElevation0Positions], end),
  };
});
