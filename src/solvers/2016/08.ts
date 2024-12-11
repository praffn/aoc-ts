import { Grid2D } from "../../lib/grid/grid2d";
import { createSolver } from "../../solution";

// rotates an array by a given amount
function rotate<T>(arr: Array<T>, by: number) {
  const copy = [...arr];
  for (let i = 0; i < arr.length; i++) {
    copy[i] = arr[(i - by + arr.length) % arr.length];
  }

  return copy;
}

function rotateColumn<T>(grid: Grid2D<T>, x: number, by: number) {
  const column = Array.from(grid.column(x));
  const shifted = rotate(column, by);
  for (let y = 0; y < grid.height; y++) {
    grid.set(x, y, shifted[y]);
  }
}

function rotateRow<T>(grid: Grid2D<T>, y: number, by: number) {
  const column = Array.from(grid.row(y));
  const shifted = rotate(column, by);
  for (let x = 0; x < grid.width; x++) {
    grid.set(x, y, shifted[x]);
  }
}

export default createSolver(async (input) => {
  const grid = new Grid2D(50, 6, " ");

  for await (const line of input) {
    const parts = line.split(" ");

    switch (parts[0]) {
      case "rect": {
        const [w, h] = parts[1].split("x").map((n) => Number.parseInt(n, 10));
        grid.fillRect(0, 0, w, h, "#");
        break;
      }
      case "rotate":
        const pos = Number.parseInt(parts[2].split("=")[1], 10);
        const by = Number.parseInt(parts[4], 10);

        if (parts[1] === "column") {
          rotateColumn(grid, pos, by);
        } else {
          rotateRow(grid, pos, by);
        }
        break;
    }
  }

  // Uncomment next line to print the grid for the answer to the second part
  // console.log(grid.toString());

  return {
    first: grid.count((v) => v === "#"),
    second: "print grid please",
  };
});
