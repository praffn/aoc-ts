import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./14";

test("2023.14", async (t) => {
  const input = `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 136);
  t.assert.equal(result.second, 64);
});
