import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./11";

test("2023.11", async (t) => {
  const input = `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 374);
  t.assert.equal(result.second, 82000210);
});
