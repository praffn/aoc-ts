import { StructuralSet } from "../../lib/collections/structural-set";
import { range } from "../../lib/iter";
import {
  add,
  chebyshev,
  directions,
  key,
  sign,
  sub,
  zero,
  type Vec2,
} from "../../lib/linalg/vec2";
import { createSolverWithLineArray } from "../../solution";

/**
 * Parses input, returning a list of pairs of the direction to move and how many
 * steps to move in that direction
 */
function parseDirections(input: Array<string>): Array<[Vec2, number]> {
  return input.map((line) => {
    const [dir, stepsStr] = line.split(" ");
    const steps = +stepsStr;

    switch (dir) {
      case "U":
        return [directions.north, steps];
      case "D":
        return [directions.south, steps];
      case "L":
        return [directions.west, steps];
      case "R":
        return [directions.east, steps];
      default:
        throw new Error(`Invalid direction: ${dir}`);
    }
  });
}

/**
 * A rope is a list of vectors that describe the position of each knot.
 */
type Rope = Array<Vec2>;

/**
 * Makes a rope of the given length, with all knots at the origin
 */
function makeRope(length: number): Rope {
  return new Array(length).fill(zero);
}

/**
 * Moves the rope in the given direction
 */
function move(rope: Rope, direction: Vec2) {
  // first, we always just move the head
  rope[0] = add(rope[0], direction);

  // now lets go through each knot in the tail and figure out if we need to move
  for (let i = 1; i < rope.length; i++) {
    const currentKnot = rope[i];
    const previousKnot = rope[i - 1];

    // if the chebyshev distance is greater than 1, (i.e. the knots are not
    // touching), we figure out the single step that would bring them together
    // and add that step to the current knot
    if (chebyshev(currentKnot, previousKnot) > 1) {
      const step = sign(sub(previousKnot, currentKnot));
      rope[i] = add(currentKnot, step);
    }
  }
}

/**
 * Moves the rope according to the given directions, tracing every unique
 * position the end knot visits along the way. Returns the number of unique
 * positions visited.
 */
function traceEnd(rope: Rope, directions: Array<[Vec2, number]>): number {
  const tailVisited = new StructuralSet(key);

  for (const [direction, steps] of directions) {
    for (const _ of range(steps)) {
      move(rope, direction);
      tailVisited.add(rope.at(-1)!);
    }
  }

  return tailVisited.size;
}

export default createSolverWithLineArray(async (input) => {
  const directions = parseDirections(input);

  return {
    first: traceEnd(makeRope(2), directions),
    second: traceEnd(makeRope(10), directions),
  };
});
