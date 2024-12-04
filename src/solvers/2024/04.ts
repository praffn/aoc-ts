import { createSolverWithLineArray } from "../../solution";

const directions = [
  [0, 1], // right
  [0, -1], // left
  [1, 0], // down
  [-1, 0], // up
  [1, 1], // down-right
  [-1, -1], // up-left
  [1, -1], // down-left
  [-1, 1], // up-right
] as const;

function isValidCoordinate(
  x: number,
  y: number,
  width: number,
  height: number
) {
  return x >= 0 && x < width && y >= 0 && y < height;
}

export default createSolverWithLineArray(async (input) => {
  const grid = input.map((line) => line.split(""));

  const height = grid.length;
  const width = grid[0].length;

  let xmas = 0;
  let masAsX = 0;

  const needle = "XMAS";

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // solve for first part
      for (const [dx, dy] of directions) {
        for (let i = 0; i < needle.length; i++) {
          const nx = x + dx * i;
          const ny = y + dy * i;

          if (!isValidCoordinate(nx, ny, width, height)) {
            break;
          }

          if (grid[ny][nx] !== needle[i]) {
            break;
          }

          if (i === needle.length - 1) {
            xmas++;
          }
        }
      }

      // solve for second part
      if (grid[y][x] === "A") {
        const tl = isValidCoordinate(x - 1, y - 1, width, height)
          ? grid[y - 1][x - 1]
          : "";
        const tr = isValidCoordinate(x + 1, y - 1, width, height)
          ? grid[y - 1][x + 1]
          : "";
        const bl = isValidCoordinate(x - 1, y + 1, width, height)
          ? grid[y + 1][x - 1]
          : "";
        const br = isValidCoordinate(x + 1, y + 1, width, height)
          ? grid[y + 1][x + 1]
          : "";

        const a = tl + br;
        const b = tr + bl;

        if ((a === "MS" || a === "SM") && (b === "MS" || b === "SM")) {
          masAsX++;
        }
      }
    }
  }

  return {
    first: xmas,
    second: masAsX,
  };
});
