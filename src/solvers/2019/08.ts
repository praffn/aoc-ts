import { Grid2D } from "../../lib/grid/grid2d";
import { chunk, counter } from "../../lib/iter";
import { createSolverWithString } from "../../solution";

const WIDTH = 25;
const HEIGHT = 6;

const BLACK = " ";
const WHITE = "#";

export default createSolverWithString(async (input, extra) => {
  const imageData = input.split("").map((n) => parseInt(n, 10));

  let fewestZeroes = Infinity;
  let bestCounts: Map<number, number> = new Map();

  const layers = Array.from(chunk(imageData, WIDTH * HEIGHT));

  for (const layer of layers) {
    const counts = counter(layer);
    const zeroCount = counts.get(0) ?? 0;
    if (zeroCount < fewestZeroes) {
      fewestZeroes = zeroCount;
      bestCounts = counts;
    }
  }

  const finalImage = new Grid2D<string>(WIDTH, HEIGHT, BLACK);

  for (const layer of layers.toReversed()) {
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        const pixel = layer[y * WIDTH + x];
        if (pixel !== 2) {
          finalImage.set(x, y, pixel === 0 ? BLACK : WHITE);
        }
      }
    }
  }

  if (extra) {
    console.log(finalImage.toString());
  }

  return {
    first: bestCounts.get(1)! * bestCounts.get(2)!,
    second: extra ? "See above" : "Pass -x to see image",
  };
});
