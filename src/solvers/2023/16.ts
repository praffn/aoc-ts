import { Array2D } from "../../lib/collections/array2d";
import { StructuralMap } from "../../lib/collections/structural-map";
import { StructuralSet } from "../../lib/collections/structural-set";
import { range } from "../../lib/iter";
import {
  add,
  directions,
  key,
  makeVec2,
  zero,
  type Vec2,
} from "../../lib/linalg/vec2";
import { createSolverWithLineArray } from "../../solution";

type PositionDirection = { position: Vec2; direction: Vec2 };
function keyPositionDirection({
  position,
  direction,
}: PositionDirection): string {
  return `${key(position)}:${key(direction)}`;
}

/**
 * Returns the total number of energized tiles after following the beam
 * originating from the given position and direction
 */
function energize(map: Array2D<string>, pd: PositionDirection): number {
  const energizedTiles = new StructuralSet(key);
  const visited = new StructuralMap<PositionDirection, number>(
    keyPositionDirection
  );

  const stack: Array<PositionDirection> = [pd];

  while (stack.length > 0) {
    const pd = stack.pop()!;

    // Stop if beam goes out of bounds
    if (!map.isInBounds(pd.position.x, pd.position.y)) {
      continue;
    }

    // If we've been here before, stop this beam
    if (visited.has(pd)) {
      continue;
    }

    // Otherwise, this tile is energized
    energizedTiles.add(pd.position);
    visited.set(pd, energizedTiles.size + 1);

    // Lets figure out where to go next
    const c = map.get(pd.position.x, pd.position.y);
    switch (c) {
      case ".":
        // Empty tile -- keep going
        stack.push({
          position: add(pd.position, pd.direction),
          direction: pd.direction,
        });
        break;
      case "-":
        // Horizontal splitter. If we hit it from north/south, we're going to
        // split the beam east and west. Otherwise just keep going
        if (pd.direction.x === 0) {
          stack.push({
            position: add(pd.position, directions.east),
            direction: directions.east,
          });
          stack.push({
            position: add(pd.position, directions.west),
            direction: directions.west,
          });
        } else {
          stack.push({
            position: add(pd.position, pd.direction),
            direction: pd.direction,
          });
        }
        break;
      case "|":
        // Vertical splitter. If we hit it from east/west, we're going to
        // split the beam north and south. Otherwise just keep going
        if (pd.direction.y === 0) {
          stack.push({
            position: add(pd.position, directions.north),
            direction: directions.north,
          });
          stack.push({
            position: add(pd.position, directions.south),
            direction: directions.south,
          });
        } else {
          stack.push({
            position: add(pd.position, pd.direction),
            direction: pd.direction,
          });
        }
        break;
      case "/": {
        // `/` mirror -- reflect the beam accordingly
        const newDirection = makeVec2(-pd.direction.y, -pd.direction.x);
        stack.push({
          position: add(pd.position, newDirection),
          direction: newDirection,
        });
        break;
      }
      case "\\": {
        // `\` mirror -- reflect the beam accordingly
        const newDirection = makeVec2(pd.direction.y, pd.direction.x);
        stack.push({
          position: add(pd.position, newDirection),
          direction: newDirection,
        });
        break;
      }
    }
  }

  // Lets return the amount of tiles we visited
  return energizedTiles.size;
}

/**
 * Returns the max amount of tiles we can energize by sending a beam from every
 * edge tile
 */
function findMaxEnergized(map: Array2D<string>) {
  // We're gonna generate all the edge tiles and their directions
  const pds: Array<PositionDirection> = [];

  for (const x of range(map.width)) {
    pds.push(
      { position: makeVec2(x, 0), direction: directions.south },
      {
        position: makeVec2(x, map.height - 1),
        direction: directions.north,
      }
    );
  }

  for (const y of range(map.height)) {
    pds.push(
      {
        position: makeVec2(0, y),
        direction: directions.east,
      },
      {
        position: makeVec2(map.width - 1, y),
        direction: directions.west,
      }
    );
  }

  // And return the maximum amount of tiles we can energize
  return Math.max(...pds.map((pd) => energize(map, pd)));
}

export default createSolverWithLineArray(async (input) => {
  const map = new Array2D(input.map((l) => l.split("")));

  return {
    first: energize(map, { position: zero, direction: directions.east }),
    second: findMaxEnergized(map),
  };
});
