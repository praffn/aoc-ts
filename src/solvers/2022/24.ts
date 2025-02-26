import { StructuralSet } from "../../lib/collections/structural-set";
import {
  add,
  cardinalDirections,
  directions,
  key,
  makeVec2,
  zero,
  type Vec2,
} from "../../lib/linalg/vec2";
import { createSolverWithLineArray } from "../../solution";

type Blizzard = [position: Vec2, direction: Vec2];

type Map = {
  min: Vec2;
  max: Vec2;
  tiles: StructuralSet<Vec2>;
  blizzards: Array<Blizzard>;
};

const arrowToDirection: Record<string, Vec2> = {
  "^": directions.north,
  v: directions.south,
  "<": directions.west,
  ">": directions.east,
};

function parse(input: Array<string>): [map: Map, start: Vec2, goal: Vec2] {
  const tiles = new StructuralSet(key);
  const blizzards: Array<Blizzard> = [];

  const height = input.length;
  const width = input[0].length;
  const start = makeVec2(1, 0);
  const goal = makeVec2(width - 2, height - 1);

  for (const [y, line] of input.entries()) {
    for (const [x, c] of line.split("").entries()) {
      if (c === "#") {
        continue;
      }
      const position = makeVec2(x, y);
      tiles.add(position);
      if (c in arrowToDirection) {
        blizzards.push([position, arrowToDirection[c]]);
      }
    }
  }

  const map = {
    min: makeVec2(1, 1),
    max: makeVec2(width - 2, height - 2),
    tiles,
    blizzards,
  };

  return [map, start, goal];
}

/**
 * "wraps" a number n, such that if n < min, it will be set to max minus
 * remainder and vice versa for min. Think of it as a modulo operation where
 * you can tell it to wrap around a different range than 0 to max.
 */
function wrap(n: number, min: number, max: number) {
  return (
    min + ((((n - min) % (max - min + 1)) + (max - min + 1)) % (max - min + 1))
  );
}

/**
 * "wraps" a vector v, such that it wraps around the bounding box given my min
 * and max vectors.
 */
function wrapVec(v: Vec2, min: Vec2, max: Vec2) {
  return makeVec2(wrap(v.x, min.x, max.x), wrap(v.y, min.y, max.y));
}

/**
 * Advances all the blizzards once. This mutates the map.
 */
function advance(map: Map) {
  for (let i = 0; i < map.blizzards.length; i++) {
    map.blizzards[i][0] = wrapVec(
      add(map.blizzards[i][0], map.blizzards[i][1]),
      map.min,
      map.max
    );
  }
}

// We can move in all cardinal directions, but we can also choose to "wait"
// which is functionally equivalent of adding the zero vector to our position.
const cardinalDirectionsAndZero = [...cardinalDirections, zero];

/**
 * Solves both parts of the challenge, yielding each in order
 */
function* solve(map: Map, start: Vec2, goal: Vec2) {
  // possiblePositions are the positions we can be at the current minute
  let possiblePositions = new StructuralSet(key);
  // initially we can only be at the start
  possiblePositions.add(start);

  // current stage of walking the map. 0 and 2 means we are walking from start
  // to goal, 1 means we are walking from goal to start.
  let stage: 0 | 1 | 2 = 0;
  let currentMinute = 1;

  // Lets start walking!
  while (true) {
    // advance the blizzards one step
    advance(map);

    // Map all blizzard positions into a set of non-navigable tiles
    const nonNavigableTiles = new StructuralSet(
      key,
      map.blizzards.map(([p]) => p)
    );

    // Lets figure out where our next possible positions could be
    const nextPossiblePositions = new StructuralSet(key);

    // We're gonna iterate over all positions we're currently in
    for (const currentPosition of possiblePositions) {
      // And try to walk in every possible direction (or wait)
      for (const direction of cardinalDirectionsAndZero) {
        const next = add(currentPosition, direction);
        if (map.tiles.has(next) && !nonNavigableTiles.has(next)) {
          // If this position is valid and not in a blizzard, we can walk here
          nextPossiblePositions.add(next);
        }
      }
    }

    switch (stage) {
      case 0:
        if (nextPossiblePositions.has(goal)) {
          // We've reached the goal!
          yield currentMinute;
          stage = 1;
          // Now lets start walking back
          nextPossiblePositions.clear();
          nextPossiblePositions.add(goal);
        }
        break;
      case 1:
        if (nextPossiblePositions.has(start)) {
          // and we're back, the elf can get his forgotten snacks back
          stage = 2;
          // now finally, lets go to the goal
          nextPossiblePositions.clear();
          nextPossiblePositions.add(start);
        }
        break;
      case 2:
        if (nextPossiblePositions.has(goal)) {
          // and we're completely done!
          yield currentMinute;
          return;
        }
        break;
    }

    possiblePositions = nextPossiblePositions;
    currentMinute++;
  }
}

export default createSolverWithLineArray(async (input) => {
  const [map, start, goal] = parse(input);

  const [first, second] = solve(map, start, goal);

  return { first, second };
});
