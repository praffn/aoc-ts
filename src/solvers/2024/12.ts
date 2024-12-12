import { Grid2D } from "../../lib/grid/grid2d";
import { createSolverWithLineArray } from "../../solution";

// Heavy inspiration from https://github.com/michel-kraemer/adventofcode-rust/blob/main/2024/day12/src/main.rs

const directions = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

function key(x: number, y: number) {
  return `${x},${y}`;
}

type Region = {
  area: number;
  horizontalSides: Array<[number, number]>;
  verticalSides: Array<[number, number]>;
};

function fill(
  x: number,
  y: number,
  c: string,
  grid: Grid2D<string>,
  seen: Set<string>
): Region {
  let area = 0;
  const horizontalSides: Array<[number, number]> = [];
  const verticalSides: Array<[number, number]> = [];

  const queue = [[x, y]];
  seen.add(key(x, y));

  while (queue.length > 0) {
    const [x, y] = queue.shift()!;
    area++;

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (grid.isValidPosition(nx, ny) && grid.at(nx, ny) === c) {
        const k = key(nx, ny);
        if (!seen.has(k)) {
          seen.add(k);
          queue.push([nx, ny]);
        }
      } else if ((dx === 1 && dy === 0) || (dx === -1 && dy === 0)) {
        verticalSides.push([y, x * 4 + dx]);
      } else {
        horizontalSides.push([x, y * 4 + dy]);
      }
    }
  }

  return { area, horizontalSides, verticalSides };
}

function removeConnected(s: [number, number], sides: [number, number][]): void {
  let a = s[0] + 1;
  while (true) {
    const index = sides.findIndex((p) => p[0] === a && p[1] === s[1]);
    if (index === -1) {
      break;
    }
    sides.splice(index, 1); // remove the element at the found index
    a += 1;
  }

  a = s[0] - 1;
  while (true) {
    const index = sides.findIndex((p) => p[0] === a && p[1] === s[1]);
    if (index === -1) {
      break;
    }
    sides.splice(index, 1); // remove the element at the found index
    a -= 1;
  }
}

export default createSolverWithLineArray(async (input) => {
  const grid = Grid2D.from2DArray(input.map((line) => line.split("")));

  let totalFencePriceByPerimeter = 0;
  let totalFencePriceBySides = 0;

  const seen = new Set<string>();
  for (const [value, x, y] of grid) {
    if (seen.has(key(x, y))) {
      continue;
    }

    const region = fill(x, y, value, grid, seen);
    totalFencePriceByPerimeter +=
      region.area *
      (region.horizontalSides.length + region.verticalSides.length);

    let sideCount = 0;
    for (const sides of [region.horizontalSides, region.verticalSides]) {
      while (sides.length > 0) {
        const s = sides.splice(0, 1)[0];
        removeConnected(s, sides);
        sideCount++;
      }
    }

    totalFencePriceBySides += region.area * sideCount;
  }

  return {
    first: totalFencePriceByPerimeter,
    second: totalFencePriceBySides,
  };
});
