import { combinations } from "../../lib/iter";
import { makeVec3, type Vec3 } from "../../lib/linalg/vec3";
import { Range } from "../../lib/range";
import { createSolverWithLineArray } from "../../solution";

// Thanks to @tckmn (https://www.reddit.com/r/adventofcode/comments/18q40he/2023_day_24_part_2_a_straightforward_nonsolver/)
// -- I still think solving it this way is magic...

type Hailstone = {
  position: Vec3;
  velocity: Vec3;
  slope2d: number;
};

function parseHailstone(line: string): Hailstone {
  const [px, py, pz, vx, vy, vz] = line.match(/-?\d+/g)!.map(Number);

  const slope2d = vx === 0 ? NaN : vy / vx;

  return {
    position: makeVec3(px, py, pz),
    velocity: makeVec3(vx, vy, vz),
    slope2d,
  };
}

type Intersection = {
  x: number;
  y: number;
};

/**
 * Returns the point of intersection between two hailstones, or null if they
 * don't intersect.
 */
function getIntersection(a: Hailstone, b: Hailstone): Intersection | null {
  // both hailstones need to have a slope, and the slopes need to be different
  if (
    Number.isNaN(a.slope2d) ||
    Number.isNaN(b.slope2d) ||
    a.slope2d === b.slope2d
  ) {
    return null;
  }

  const ac = a.position.y - a.slope2d * a.position.x;
  const bc = b.position.y - b.slope2d * b.position.x;

  const x = (bc - ac) / (a.slope2d - b.slope2d);
  const t1 = (x - a.position.x) / a.velocity.x;
  const t2 = (x - b.position.x) / b.velocity.x;

  // we dont want to consider intersections in the past
  if (t1 < 0 || t2 < 0) {
    return null;
  }

  const y = a.slope2d * (x - a.position.x) + a.position.y;

  return { x, y };
}

/**
 * Performs Gaussian elimination with back substitution on a matrix.
 */
function eliminate(m: number[][]): number[][] {
  for (let i = 0; i < m.length; i++) {
    const t = m[i][i];
    m[i] = m[i].map((x) => x / t);

    for (let j = i + 1; j < m.length; j++) {
      const t = m[j][i];
      m[j] = m[j].map((x, k) => x - t * m[i][k]);
    }
  }

  for (let i = m.length - 1; i >= 0; i--) {
    for (let j = 0; j < i; j++) {
      const t = m[j][i];
      m[j] = m[j].map((x, k) => x - t * m[i][k]);
    }
  }

  return m;
}

/**
 * Makes a matrix out of the required coefficients for solving the linear system
 */
function makeMatrix(
  hailstones: Hailstone[],
  x: keyof Vec3,
  y: keyof Vec3,
  dx: keyof Vec3,
  dy: keyof Vec3
): number[][] {
  const m: number[][] = [];

  for (let i = 0; i < 4; i++) {
    const { velocity, position } = hailstones[i];
    m.push([
      -velocity[dy],
      velocity[dx],
      position[y],
      -position[x],
      position[y] * velocity[dx] - position[x] * velocity[dy],
    ]);
  }

  const h4 = hailstones[4];
  const lastRow = [
    -h4.velocity[dy],
    h4.velocity[dx],
    h4.position[y],
    -h4.position[x],
    h4.position[y] * h4.velocity[dx] - h4.position[x] * h4.velocity[dy],
  ];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 5; j++) {
      m[i][j] -= lastRow[j];
    }
  }

  return m;
}

/**
 * Returns the number of intersections between any pair of hailstones within the
 * given range.
 */
function solveFirst(hailstones: Array<Hailstone>, range: Range) {
  let intersections = 0;
  for (const [a, b] of combinations(hailstones, 2)) {
    const intersection = getIntersection(a, b);
    if (
      intersection &&
      range.contains(intersection.x) &&
      range.contains(intersection.y)
    ) {
      intersections++;
    }
  }

  return intersections;
}

/**
 * Returns the sum of the x, y, and z coordinates of a rock thrown at t = 0
 * that will intersect with all other hailstones.
 */
function solveSecond(hailstones: Array<Hailstone>) {
  const s1 = eliminate(makeMatrix(hailstones, "x", "y", "x", "y"));
  const s2 = eliminate(makeMatrix(hailstones, "z", "y", "z", "y"));

  const x = s1[0].at(-1)!;
  const y = s1[1].at(-1)!;
  const z = s2[0].at(-1)!;

  return Math.floor(x + y + z);
}

export default createSolverWithLineArray(
  async (input, _, rangeMin = 2e14, rangeMax = 4e14) => {
    const hailstones = input.map(parseHailstone);

    return {
      first: solveFirst(hailstones, new Range(rangeMin, rangeMax)),
      second: solveSecond(hailstones),
    };
  }
);
