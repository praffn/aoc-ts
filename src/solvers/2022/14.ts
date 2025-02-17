import { StructuralSet } from "../../lib/collections/structural-set";
import { slidingWindow } from "../../lib/iter";
import {
  add,
  directions,
  equals,
  key,
  makeVec2,
  sign,
  sub,
  type Vec2,
} from "../../lib/linalg/vec2";
import { createSolverWithLineArray } from "../../solution";

type Map = {
  rock: StructuralSet<Vec2>;
  sand: StructuralSet<Vec2>;
  floor: number;
};

/**
 * Parses the input returning a set of positions for the rock, and empty set of
 * positions of sand and the floor (max y value of the rock + 2)
 */
function parse(input: Array<string>): Map {
  const rock = new StructuralSet(key);

  for (const line of input) {
    const points = line.split(" -> ").map((p) => {
      const [x, y] = p.split(",");
      return makeVec2(+x, +y);
    });
    for (const [a, b] of slidingWindow(points, 2)) {
      const step = sign(sub(b, a));
      let current = a;
      while (!equals(current, b)) {
        rock.add(current);
        current = add(current, step);
      }
      rock.add(b);
    }
  }

  return {
    rock,
    sand: new StructuralSet(key),
    floor: Math.max(...rock.values().map((p) => p.y)) + 2,
  };
}

// the prioritized list of directions a grain of sand wants to move
const sandDirections = [
  directions.south,
  directions.southwest,
  directions.southeast,
];

/**
 * Returns the new position of a grain of sand.
 *
 * It will first attempt to move down, then left-down, then right-down. If all
 * positions are occupied by rock or sand, it will return null (settled)
 */
function findNewPosition(
  grain: Vec2,
  map: Map,
  withFloor: boolean
): Vec2 | null {
  for (const dir of sandDirections) {
    const newPosition = add(grain, dir);
    if (!map.rock.has(newPosition) && !map.sand.has(newPosition)) {
      if (!withFloor || newPosition.y !== map.floor) {
        return newPosition;
      }
    }
  }

  return null;
}

/**
 * Creates a grain of sand on the map and allows it to settle.
 * Returns true if the grain settled, false if it fell off the map or the sand
 * outlet was blocked.
 */
function createGrain(map: Map, withFloor: boolean) {
  let grain = makeVec2(500, 0);

  if (map.sand.has(grain)) {
    // outlet is blocked -- no more sand
    return false;
  }

  while (true) {
    if (!withFloor && grain.y >= map.floor) {
      // we don't have a floor, so we're in the abyss now...
      return false;
    }

    // lets find the next position for the grain
    const newPosition = findNewPosition(grain, map, withFloor);

    // no new position, so the grain has settled. Add it to the map and stop
    if (!newPosition) {
      map.sand.add(grain);
      break;
    }

    // otherwise, update position and continue
    grain = newPosition;
  }

  return true;
}

function solve(map: Map, withFloor: boolean) {
  // deepish clone so we can use the map for both solutions
  const clone = {
    rock: map.rock.clone(),
    sand: map.sand.clone(),
    floor: map.floor,
  };

  // createGrains until abyss hit or outlet blocked
  while (createGrain(clone, withFloor)) {}

  // return the number of grains of sand
  return clone.sand.size;
}

export default createSolverWithLineArray(async (input) => {
  const map = parse(input);

  return {
    first: solve(map, false),
    second: solve(map, true),
  };
});
