import { range } from "../../lib/iter";
import {
  add,
  directions,
  key,
  makeVec2,
  type Vec2,
} from "../../lib/linalg/vec2";
import { createSolver } from "../../solution";

function* getRange(value: string) {
  if (value.includes("..")) {
    const [start, end] = value.split("..").map((v) => parseInt(v));
    return yield* range(start, end + 1);
  }

  yield parseInt(value);
}

function parseLine(line: string): Array<Vec2> {
  const positions: Array<Vec2> = [];
  const [a, b] = line.split(", ");
  let [axisA, valueA] = a.split("=");
  let [, valueB] = b.split("=");

  if (axisA === "y") {
    [valueA, valueB] = [valueB, valueA];
  }

  for (const x of getRange(valueA)) {
    for (const y of getRange(valueB)) {
      positions.push(makeVec2(x, y));
    }
  }

  return positions;
}

const WATER = "~";
const STREAM = "|";
const CLAY = "#";

type Element = typeof WATER | typeof STREAM | typeof CLAY;

/**
 * Returns true if there is nothing (i.e. sand) at the given position, or if
 * it is just a stream. False if clay or water
 */
function isOpen(position: Vec2, map: Map<string, Element>) {
  const element = map.get(key(position));
  return !element || element === STREAM;
}

// Helper functions to move around

function left(position: Vec2) {
  return add(position, directions.west);
}

function right(position: Vec2) {
  return add(position, directions.east);
}

function down(position: Vec2) {
  return add(position, directions.south);
}

// Recursively fills the map with streams and water
function fill(map: Map<string, Element>, position: Vec2, maxY: number) {
  // if we are out of bounds, return
  if (position.y > maxY) {
    return;
  }

  // if we are not open, return
  if (!isOpen(position, map)) {
    return;
  }

  if (!isOpen(down(position), map)) {
    // we hit this if we cannot go down.

    // First we go left until we hit a wall and there is no sand beneath us
    let leftPosition = position;
    while (isOpen(leftPosition, map) && !isOpen(down(leftPosition), map)) {
      // fill the current position with stream
      map.set(key(leftPosition), STREAM);
      leftPosition = left(leftPosition);
    }

    // now we do the same for the right side
    let rightPosition = right(position);
    while (isOpen(rightPosition, map) && !isOpen(down(rightPosition), map)) {
      // fill the current position with stream
      map.set(key(rightPosition), STREAM);
      rightPosition = right(rightPosition);
    }

    const leftDown = down(leftPosition);
    const rightDown = down(rightPosition);

    // now we know how far left and right we can go.
    if (isOpen(leftDown, map) || isOpen(rightDown, map)) {
      // if we can go down on either side, we fill those positions
      fill(map, leftPosition, maxY);
      fill(map, rightPosition, maxY);
    } else if (
      map.get(key(leftPosition)) === CLAY &&
      map.get(key(rightPosition)) === CLAY
    ) {
      // otherwise, if we have a wall on bot sides we can create a pool
      for (let x = leftPosition.x + 1; x < rightPosition.x; x++) {
        map.set(key(makeVec2(x, position.y)), WATER);
      }
    }
  } else if (!map.has(key(position))) {
    // otherwise we continue filling downwards
    map.set(key(position), STREAM);
    fill(map, down(position), maxY);
    if (map.get(key(down(position))) === WATER) {
      fill(map, position, maxY);
    }
  }
}

export default createSolver(async (input) => {
  const map = new Map<string, Element>();
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for await (const line of input) {
    for (const position of parseLine(line)) {
      map.set(key(position), CLAY);
      minX = Math.min(minX, position.x);
      maxX = Math.max(maxX, position.x);
      minY = Math.min(minY, position.y);
      maxY = Math.max(maxY, position.y);
    }
  }

  // Start by filling
  fill(map, makeVec2(500, 0), maxY);

  // Now we count the water and stream
  let water = 0;
  let stream = 0;
  for (let x = minX - 1; x <= maxX + 1; x++) {
    for (let y = minY; y <= maxY; y++) {
      const element = map.get(key(makeVec2(x, y)));
      if (element === STREAM) {
        stream++;
      } else if (element === WATER) {
        water++;
      }
    }
  }

  return {
    first: water + stream,
    second: water,
  };
});
