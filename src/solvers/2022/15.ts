import { StructuralMap } from "../../lib/collections/structural-map";
import { key, makeVec2, manhattan, type Vec2 } from "../../lib/linalg/vec2";
import { createSolverWithLineArray } from "../../solution";

// Thanks to i_have_no_biscuits for the heavy optimization ideas for the second
// part of this puzzle!
// https://www.reddit.com/r/adventofcode/comments/zmcn64/comment/j0b90nr

const re = /-?\d+/g;
/**
 * Parses the input, returning an array of scanner/beacon pairs
 */
function parse(input: Array<string>): Array<{ scanner: Vec2; beacon: Vec2 }> {
  const pairs: Array<{ scanner: Vec2; beacon: Vec2 }> = [];

  for (const line of input) {
    const [sx, sy, bx, by] = line.match(re)!.map(Number);
    pairs.push({
      scanner: makeVec2(sx, sy),
      beacon: makeVec2(bx, by),
    });
  }

  return pairs;
}

/**
 * Returns the amount of positions that *cannot* contain a beacon at the given
 * y-coordinate.
 */
function solvePart1(
  pairs: Array<{ scanner: Vec2; beacon: Vec2 }>,
  yTarget = 2_000_000
) {
  // stores the x-coordinate of all beacons at the target y-coordinate
  const beaconsAtY = new Set<number>();
  // stores the x-coordinates of all positions that are covered by a scanner
  const coveredX = new Set<number>();

  for (const { scanner, beacon } of pairs) {
    const radius = manhattan(scanner, beacon);

    if (beacon.y === yTarget) {
      // lets add beacon if it is exactly at the target y-coordinate
      beaconsAtY.add(beacon.x);
    }

    // if yTarget is within the scanner's reach, we add all the x-coordinates
    // that are covered by the scanner in yTarget
    const dy = Math.abs(scanner.y - yTarget);
    if (dy <= radius) {
      const dxRange = radius - dy;
      for (let x = scanner.x - dxRange; x <= scanner.x + dxRange; x++) {
        coveredX.add(x);
      }
    }
  }

  // All covered x-coordinates minus the beacons at yTarget
  // those _definitelly_ cannot contain another beacon
  return coveredX.size - beaconsAtY.size;
}

/**
 * Finds the first position that is not covered by any scanner, and returns the
 * sum of its x coordinate multiplied by 4_000_000 plus its y coordinate.
 */
function solvePart2(
  pairs: Array<{ scanner: Vec2; beacon: Vec2 }>,
  bounds = 4_000_000
) {
  const radii = new StructuralMap<Vec2, number>(key);

  for (const { scanner, beacon } of pairs) {
    const radius = manhattan(scanner, beacon);
    radii.set(scanner, radius);
  }

  // the range of each scanner is a _diamond_. We can describe the diamond as
  // 4 line segments. We store these line segments in acoeffs and bcoeffs

  const acoeffs = new Set<number>(); // <- (y - x ± radius + 1)
  const bcoeffs = new Set<number>(); // <- (x + y ± radius + 1)

  for (const [scanner, radius] of radii) {
    const { x, y } = scanner;

    acoeffs.add(y - x + radius + 1);
    acoeffs.add(y - x - radius - 1);
    bcoeffs.add(x + y + radius + 1);
    bcoeffs.add(x + y - radius - 1);
  }

  // Find intersection points of the boundary lines
  for (const a of acoeffs) {
    for (const b of bcoeffs) {
      const px = Math.floor((b - a) / 2);
      const py = Math.floor((a + b) / 2);

      // Ensure the point is within bounds
      if (0 < px && px < bounds && 0 < py && py < bounds) {
        const p = makeVec2(px, py);
        // Check if the point is outside all scanner coverage areas
        if (
          radii.entries().every(([scanner, radius]) => {
            return manhattan(scanner, p) > radius;
          })
        ) {
          // gotcha!
          return 4_000_000 * px + py;
        }
      }
    }
  }

  throw new Error("No solution found");
}

export default createSolverWithLineArray(async (input, _, yTarget, bounds) => {
  const pairs = parse(input);

  return {
    first: solvePart1(pairs, yTarget),
    second: solvePart2(pairs, bounds),
  };
});
