import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./03";

test("2020.03", async (t) => {
  const input = `..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 7);
  t.assert.equal(result.second, 336);
});
