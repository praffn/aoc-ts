import { StructuralMap } from "../../lib/collections/structural-map";
import { combinations, max, maxBy, range } from "../../lib/iter";
import {
  equals,
  hashKey,
  makeVec3,
  manhattan,
  sub,
  zero,
  type Vec3,
} from "../../lib/linalg/vec3";
import { createSolverWithString } from "../../solution";

// Huge thanks to boutell
// I... struggled...
// https://github.com/boutell/advent-of-code-2021/blob/main/day-19b.ts

type Scanner = Array<Vec3>;

function parse(input: string): Array<Scanner> {
  const scanners: Array<Scanner> = [];

  for (const block of input.split("\n\n")) {
    const scanner: Scanner = [];

    for (const line of block.split("\n").slice(1)) {
      const [x, y, z] = line.split(",");
      scanner.push(makeVec3(+x, +y, +z));
    }

    scanners.push(scanner);
  }

  return scanners;
}

/**
 * Returns a new vector that is rotated to face the given direction.
 */
function face(v: Vec3, facing: number) {
  const { x, y, z } = v;
  switch (facing) {
    case 0:
      return v;
    case 1:
      return makeVec3(z, y, -x);
    case 2:
      return makeVec3(-x, y, -z);
    case 3:
      return makeVec3(-z, y, x);
    case 4:
      return makeVec3(x, -z, y);
    case 5:
      return makeVec3(x, z, -y);
    default:
      throw new Error(`Invalid facing: ${facing}`);
  }
}

/**
 * Returns a new vector that is rotated 90 degress clockwise around the z-axis
 * the given amount of times
 */
function rotate(v: Vec3, rotation: number) {
  const { x, y, z } = v;
  switch (rotation) {
    case 0:
      return v;
    case 1:
      return makeVec3(y, -x, z);
    case 2:
      return makeVec3(-x, -y, z);
    case 3:
      return makeVec3(-y, x, z);
    default:
      throw new Error(`Invalid rotation: ${rotation}`);
  }
}

/**
 * Orients all entries in the scanner by facing and rotating the vectors by
 * the provided values
 */
function orient(scanner: Scanner, facing: number, rotation: number) {
  return scanner.map((v) => rotate(face(v, facing), rotation));
}

/**
 * Attempts to correlate the two scanners by finding a translation that
 * aligns the two scanners. If a correlation is found, the translation is
 * added to the distances array and the second scanner is updated with the
 * new beacons.
 */
function correlate(a: Scanner, b: Scanner, distances: Array<Vec3>): boolean {
  for (const facing of range(6)) {
    for (const rotation of range(4)) {
      const differences = new StructuralMap<Vec3, Array<[number, number]>>(
        hashKey
      );

      const oriented = orient(b, facing, rotation);
      for (const [aIndex, aEntry] of a.entries()) {
        for (const [bIndex, bEntry] of oriented.entries()) {
          const diff = sub(bEntry, aEntry);
          if (!differences.has(diff)) {
            differences.set(diff, []);
          }
          differences.get(diff)!.push([aIndex, bIndex]);
        }
      }

      const maxDifference = maxBy(differences, ([, v]) => v.length)![0];
      const correlation = differences.get(maxDifference)!;
      if (correlation.length >= 12) {
        distances.push(maxDifference);
        for (const beacon of oriented) {
          const translated = sub(beacon, maxDifference);
          if (!a.find((v) => equals(v, translated))) {
            a.push(translated);
          }
        }
        return true;
      }
    }
  }

  return false;
}

export default createSolverWithString(async (input) => {
  let scanners = parse(input);
  const distances: Array<Vec3> = [zero];

  while (scanners.length > 1) {
    for (const [a, b] of combinations(scanners, 2)) {
      if (correlate(a, b, distances)) {
        scanners = scanners.filter((scanner) => scanner !== b);
        break;
      }
    }
  }

  const maxDistance = max(
    combinations(distances, 2).map(([a, b]) => manhattan(a, b)),
    -1
  );

  return {
    first: scanners[0].length,
    second: maxDistance,
    // second: y.result,
  };
});
