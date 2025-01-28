import { Grid2D } from "../../lib/grid/grid2d";
import { add, makeVec2, scale, type Vec2 } from "../../lib/linalg/vec2";
import { createSolverWithLineArray } from "../../solution";

type Point = {
  position: Vec2;
  velocity: Vec2;
};

const n = (s: string) => Number.parseInt(s);
const re = /position=<\s*(-?\d+),\s*(-?\d+)> velocity=<\s*(-?\d+),\s*(-?\d+)>/;
function parsePoint(line: string): Point {
  const [, px, py, vx, vy] = line.match(re)!;
  return {
    position: makeVec2(n(px), n(py)),
    velocity: makeVec2(n(vx), n(vy)),
  };
}

function print(
  points: Array<Point>,
  t: number,
  dimensions: { width: number; height: number }
) {
  const positions = points.map(({ position, velocity }) =>
    add(position, scale(velocity, t))
  );
  const grid = new Grid2D(dimensions.width, dimensions.height, " ");
  const minX = Math.min(...positions.map((p) => p.x));
  const minY = Math.min(...positions.map((p) => p.y));

  for (const pos of positions) {
    grid.set(pos.x - minX, pos.y - minY, "#");
  }

  console.log(grid.toString());
}

export default createSolverWithLineArray(async (input, extra) => {
  const points = input.map(parsePoint);

  let smallestArea = Infinity;
  let smallestDimensions = { width: 0, height: 0 };
  let smallestAreaTime = 0;

  for (let i = 10_000; i < 10_0000; i++) {
    const positions = points.map(({ position, velocity }) =>
      add(position, scale(velocity, i))
    );

    const minX = Math.min(...positions.map((p) => p.x));
    const maxX = Math.max(...positions.map((p) => p.x));
    const minY = Math.min(...positions.map((p) => p.y));
    const maxY = Math.max(...positions.map((p) => p.y));

    const width = maxX - minX + 1;
    const height = maxY - minY + 1;

    const area = width * height;
    if (area < smallestArea) {
      smallestArea = area;
      smallestDimensions = { width, height };
      smallestAreaTime = i;
    }
  }

  if (extra) {
    print(points, smallestAreaTime, smallestDimensions);
  }

  return {
    first: extra ? "See above" : "Pass -x to see solution",
    second: smallestAreaTime,
  };
});
