import { cartesianRange } from "../../lib/iter";
import { add, makeVec2, zero, type Vec2 } from "../../lib/linalg/vec2";
import { createSolverWithString } from "../../solution";

type BoundingBox = {
  min: Vec2;
  max: Vec2;
};

const re = /x=(-?\d+)\.\.(-?\d+), y=(-?\d+)\.\.(-?\d+)/;
function parse(input: string): BoundingBox {
  console.log(input);
  const [, minX, maxX, minY, maxY] = input.match(re)!;
  return {
    min: makeVec2(+minX, +minY),
    max: makeVec2(+maxX, +maxY),
  };
}

/**
 * Returns true if a shot with the given velocity at the given position will
 * land inside the bounding box.
 */
function willLandInsideBoundingBox(
  boundingBox: BoundingBox,
  velocity: Vec2,
  position = zero
) {
  const { min, max } = boundingBox;

  // If a shot has "passed" the bounding box, it will never land inside it.
  if (position.x > max.x || position.y < min.y) {
    return false;
  }

  // And if a shot is already inside the bounding box, well... it will land
  // inside it.
  if (position.x >= min.x && position.y <= max.y) {
    return true;
  }

  // Otherwise, lets compute the next position and velocity of the shot, and
  // recursively check if it will land inside the bounding box.
  const nextPosition = add(position, velocity);
  const newVelocity = makeVec2(
    velocity.x - (velocity.x > 0 ? 1 : 0),
    velocity.y - 1
  );

  return willLandInsideBoundingBox(boundingBox, newVelocity, nextPosition);
}

function getHighestY(boundingBox: BoundingBox) {
  return (boundingBox.min.y * (boundingBox.min.y + 1)) / 2;
}

/**
 * Returns the number of shots that will land inside the bounding box.
 */
function countAllShotsThatLand(boundingBox: BoundingBox) {
  const { min, max } = boundingBox;
  let hits = 0;

  for (const [x, y] of cartesianRange(1, 1 + max.x, min.y, -min.y)) {
    if (willLandInsideBoundingBox(boundingBox, makeVec2(x, y))) {
      hits++;
    }
  }

  return hits;
}

export default createSolverWithString(async (input) => {
  const boundingBox = parse(input);

  return {
    first: getHighestY(boundingBox),
    second: countAllShotsThatLand(boundingBox),
  };
});
