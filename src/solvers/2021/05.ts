import { StructuralMap } from "../../lib/collections/structural-map";
import { count } from "../../lib/iter";
import { key, makeVec2, sub, type Vec2 } from "../../lib/linalg/vec2";
import { createSolverWithLineArray } from "../../solution";

type LineSegment = {
  p: Vec2;
  q: Vec2;
};

const re = /^(\d+),(\d+) -> (\d+),(\d+)$/;
function parse(input: Array<string>): Array<LineSegment> {
  const lineSegments: Array<LineSegment> = [];

  for (const line of input) {
    const [, px, py, qx, qy] = line.match(re)!;
    lineSegments.push({
      p: makeVec2(+px, +py),
      q: makeVec2(+qx, +qy),
    });
  }

  return lineSegments;
}

/**
 * Returns true if the line segment is axis-aligned, i.e. it is perfectly
 * horizontal or vertical.
 */
function isAxisAligned({ p, q }: LineSegment) {
  return p.x === q.x || p.y === q.y;
}

/**
 * Returns an iterator that yields all points on the line segment.
 * Uses Bresenham's line algorithm.
 *    See: https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm
 */
function* bresenham({ p, q }: LineSegment) {
  let x = p.x;
  let y = p.y;

  const diff = sub(q, p);
  const dx = Math.abs(diff.x);
  const dy = Math.abs(diff.y);
  const sx = Math.sign(diff.x);
  const sy = Math.sign(diff.y);
  let err = dx - dy;

  while (true) {
    yield makeVec2(x, y);

    if (x === q.x && y === q.y) {
      break;
    }

    let e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }

    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }
}

export default createSolverWithLineArray(async (input) => {
  const lineSegments = parse(input);

  // intersections and axisAlignedIntersection are maps from points to the
  // number of line segments that pass through that point.
  // axisAlignedIntersection only counts points that are on axis-aligned line
  const intersections = new StructuralMap<Vec2, number>(key);
  const axisAlignedIntersection = new StructuralMap<Vec2, number>(key);

  // Go through each line segment
  for (const lineSegment of lineSegments) {
    // Go through each point on the line segment
    for (const point of bresenham(lineSegment)) {
      if (isAxisAligned(lineSegment)) {
        // Increment point if the line segment is axis-aligned
        axisAlignedIntersection.set(
          point,
          (axisAlignedIntersection.get(point) ?? 0) + 1
        );
      }
      // Always increment point
      intersections.set(point, (intersections.get(point) ?? 0) + 1);
    }
  }

  // Count the number of points that have at least two line segments passing
  const first = count(axisAlignedIntersection.values(), (v) => v >= 2);
  const second = count(intersections.values(), (v) => v >= 2);

  return {
    first,
    second,
  };
});
