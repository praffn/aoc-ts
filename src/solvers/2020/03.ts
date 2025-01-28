import { numericProduct } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

/**
 * Returns the number of trees encountered when traversing the map
 * with the given slope, wrapping around on the x-axis.
 */
function traverse(map: Array<Array<string>>, dx: number, dy: number) {
  let x = 0;
  let y = 0;
  let trees = 0;

  while (y < map.length) {
    if (map[y][x % map[y].length] === "#") {
      trees++;
    }

    x += dx;
    y += dy;
  }

  return trees;
}

export default createSolverWithLineArray(async (input) => {
  const map = input.map((line) => line.split(""));

  const slopesToCheck = [
    [1, 1],
    [5, 1],
    [7, 1],
    [1, 2],
  ];

  const first = traverse(map, 3, 1);
  const second =
    first *
    numericProduct(slopesToCheck.map(([dx, dy]) => traverse(map, dx, dy)));

  return {
    first: first,
    second: second,
  };
});
