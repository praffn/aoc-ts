import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./13";

test("2023.13", async (t) => {
  const input = `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 405);
  t.assert.equal(result.second, 400);
});
