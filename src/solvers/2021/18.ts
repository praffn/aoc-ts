import { max, permutations } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

// Thanks to `1vader` for huge inspiration
// https://www.reddit.com/r/adventofcode/comments/rizw2c/comment/hp0o32g

type Snail = number | [Snail, Snail];

function parseSnail(line: string): Snail {
  // assuming valid input...
  return JSON.parse(line);
}

/**
 * Adds `n` to the leftmost number in the snail.
 * If the snail is a number, it will be added to that number.
 */
function addLeft(s: Snail, n: number): Snail {
  if (typeof s === "number") {
    return s + n;
  }

  const [a, b] = s;

  return [addLeft(a, n), b];
}

/**
 * Adds `n` to the rightmost number in the snail.
 * If the snail is a number, it will be added to that number.
 */
function addRight(s: Snail, n: number): Snail {
  if (typeof s === "number") {
    return s + n;
  }

  const [a, b] = s;

  return [a, addRight(b, n)];
}

/**
 * Explodes the snail, returning a 4-tuple with the following values:
 *
 * - `didExplode`: whether the snail exploded.
 * - `left`: the number that was on the left side of the snail.
 * - `result`: the snail after the explosion.
 * - `right`: the number that was on the right side of the snail.
 */
function explode(
  s: Snail,
  depth = 4
): [didExplode: boolean, left: number, result: Snail, right: number] {
  // if the snail is a number, it can't explode
  if (typeof s === "number") {
    return [false, 0, s, 0];
  }

  const [a, b] = s;

  if (depth === 0) {
    // if we reached the maximum depth we must explode.
    // if both sides are not numbers we must have reached an invalid state.
    if (typeof a === "number" && typeof b === "number") {
      return [true, a, 0, b];
    }
    throw new Error("invalid state");
  }

  // We are not at maximum depth, so lets try exploding left hand side first
  const [lhsDidExplode, lhsA, lhs, lhsB] = explode(a, depth - 1);
  if (lhsDidExplode) {
    return [true, lhsA, [lhs, addLeft(b, lhsB)], 0];
  }

  // And if that did not explode, lets try the right hand side
  const [rhsDidExplode, rhsA, rhs, rhsB] = explode(b, depth - 1);
  if (rhsDidExplode) {
    return [true, 0, [addRight(a, rhsA), rhs], rhsB];
  }

  // If neither side exploded, we are done
  return [false, 0, s, 0];
}

/**
 * Splits the snail, such that no numeric value is greater than 10.
 * The function returns a pair with the following values:
 *
 * - `didSplit`: whether the snail was split.
 * - `result`: the snail after the split.
 */
function split(s: Snail): [didSplit: boolean, result: Snail] {
  if (typeof s === "number") {
    if (s >= 10) {
      // if the number is greater than 10, we must split it
      return [true, [Math.floor(s / 2), Math.ceil(s / 2)]];
    }

    // otherwise, we're good to go
    return [false, s];
  }

  // the snail was not a number. Let's try splitting the left or right hand side
  const [a, b] = s;

  const [lhsDidSplit, lhs] = split(a);
  if (lhsDidSplit) {
    return [true, [lhs, b]];
  }

  const [rhsDidSplit, rhs] = split(b);
  return [rhsDidSplit, [a, rhs]];
}

/**
 * Adds two snails together, reducing the result.
 */
function add(a: Snail, b: Snail) {
  return reduce([a, b]);
}

/**
 * Reduces the snail by exploding and splitting it, until it cannot be further
 * reduced.
 */
function reduce(s: Snail): Snail {
  let didChange = false;

  while (true) {
    [didChange, , s] = explode(s);
    if (didChange) {
      continue;
    }
    [didChange, s] = split(s);
    if (!didChange) {
      break;
    }
  }

  return s;
}

/**
 * Returns the magnitude of a snail.
 * Assumes that the snail has been reduced.
 */
function magnitude(s: Snail): number {
  if (typeof s === "number") {
    return s;
  }

  const [a, b] = s;
  return 3 * magnitude(a) + 2 * magnitude(b);
}

export default createSolverWithLineArray(async (input) => {
  const snails = input.map(parseSnail);
  const finalSum = snails.reduce(add, 0);
  const finalMagnitude = magnitude(finalSum);
  const maxMagnitude = max(
    permutations(snails, 2).map(([a, b]) => magnitude(add(a, b))),
    -1
  );

  return {
    first: finalMagnitude,
    second: maxMagnitude,
  };
});
