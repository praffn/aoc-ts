import { StructuralMap } from "../../lib/collections/structural-map";
import { sum } from "../../lib/iter";
import {
  key,
  makeVec3,
  type Vec3,
  clamp,
  min,
  max,
  lte,
} from "../../lib/linalg/vec3";
import { createSolverWithLineArray } from "../../solution";

// Thanks to Boojum for the idea of using signed volume bounding boxes.
// https://www.reddit.com/r/adventofcode/comments/rlxhmg/comment/hpizza8

//#region BoundingBox

/**
 * Represents an axis-aligned bounding box in 3D space.
 */
type BoundingBox = {
  min: Vec3;
  max: Vec3;
};

/**
 * Returns true af the bounding box is outside the given range.
 */
function isOutsideRange(
  boundingBox: BoundingBox,
  minCoord: number,
  maxCoord: number
) {
  return (
    boundingBox.max.x < minCoord ||
    boundingBox.min.x > maxCoord ||
    boundingBox.max.y < minCoord ||
    boundingBox.min.y > maxCoord ||
    boundingBox.max.z < minCoord ||
    boundingBox.min.z > maxCoord
  );
}

/**
 * Returns a new bounding box with the coordinates clamped to the given range.
 */
function clampBoundingBox(
  boundingBox: BoundingBox,
  minCoord: number,
  maxCoord: number
) {
  return {
    min: clamp(boundingBox.min, minCoord, maxCoord),
    max: clamp(boundingBox.max, minCoord, maxCoord),
  };
}

/**
 * Returns a new bounding box representing the intersection of the two given
 * bounding boxes, or undefined if they do not intersect.
 */
function findIntersection(
  a: BoundingBox,
  b: BoundingBox
): BoundingBox | undefined {
  // const intersectionMin = max(a.max, b.max);
  // const intersectionMax = min(a.min, b.min);

  const intersectionMin = max(a.min, b.min);
  const intersectionMax = min(a.max, b.max);

  if (lte(intersectionMin, intersectionMax)) {
    return { min: intersectionMin, max: intersectionMax };
  }
}

/**
 * Returns the volume of the given bounding box.
 */
function volume(boundingBox: BoundingBox) {
  return (
    (boundingBox.max.x - boundingBox.min.x + 1) *
    (boundingBox.max.y - boundingBox.min.y + 1) *
    (boundingBox.max.z - boundingBox.min.z + 1)
  );
}

/**
 * Returns a string key for the given bounding box. Used for "hashing" the
 * bounding box for usage in a map.
 */
function keyBoundingBox(cuboid: BoundingBox) {
  return `${key(cuboid.min)}|${key(cuboid.max)}`;
}

//#endregion

//#region Parsing

type Instruction = {
  isOn: boolean;
  region: BoundingBox;
};

/**
 * Parses the input, returning an array of instructions.
 */
function parse(input: Array<string>): Array<Instruction> {
  const instructions: Array<Instruction> = [];

  for (const line of input) {
    const isOn = line.startsWith("on");
    const [minX, maxX, minY, maxY, minZ, maxZ] = line
      .matchAll(/(-?\d+)/g)
      .map((m) => m[0]);

    instructions.push({
      isOn,
      region: {
        min: makeVec3(+minX, +minY, +minZ),
        max: makeVec3(+maxX, +maxY, +maxZ),
      },
    });
  }

  return instructions;
}

//#endregion

//#region Reboot

/**
 * Performs the reboot sequence with the given input and returns the total
 * number of cubes that are on within the given bounds.
 */
function reboot(instructions: Array<Instruction>, bounds: number) {
  const MIN_COORD = -bounds;
  const MAX_COORD = bounds;

  // cubes represent signed volume bounding boxes.
  // a bounding box in this map represents an area of cubes that are either
  // on (value: 1) or off (value: -1) (or neither, value: 0).
  const cubes = new StructuralMap<BoundingBox, number>(keyBoundingBox);

  // Lets go through all instructions for the reboot sequence.
  for (const { isOn, region } of instructions) {
    // If the bounding box is outside of the range we care about we can just
    // skip it entirely.
    if (isOutsideRange(region, MIN_COORD, MAX_COORD)) {
      continue;
    }

    // Otherwise we will clamp it to the bounds
    const clampedRegion = clampBoundingBox(region, MIN_COORD, MAX_COORD);

    // Lets create a new map that will represent the changes we will make to
    // the cubes map.
    const update = new StructuralMap<BoundingBox, number>(keyBoundingBox);

    // Now lets go through all the signed volume bounding boxes we have already
    // added to the cubes map.
    for (const [otherRegion, sign] of cubes.entries()) {
      // Lets check if the current bounding box intersects with this one
      const intersection = findIntersection(clampedRegion, otherRegion);

      if (intersection) {
        // Ok there is an intersection.
        // Lets "reverse" whatever the the existing bounding box did, i.e.
        // if it turned on cubes, we will turn them off in the intersection
        update.update(intersection, (c) => c - sign, 0);
      }
    }

    // Lets turn on the cubes by adding the bounding box with a positive sign
    if (isOn) {
      update.update(clampedRegion, (c) => c + 1, 0);
    }

    // And finally we will apply the changes to the cubes map.
    for (const [region, count] of update.entries()) {
      cubes.update(region, (c) => c + count, 0);
    }
  }

  // We will now calculate the volume of each bounding box and multiply it by
  // the sign (-1, 0, 1). This will give use the final total (unsigned) volume
  // of all the cubes that are on.
  return sum(cubes.entries().map(([region, count]) => volume(region) * count));
}

//#endregion

export default createSolverWithLineArray(async (input) => {
  const steps = parse(input);

  return {
    first: reboot(steps, 50),
    second: reboot(steps, Infinity),
  };
});
