import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./18";

test("2015.18", async (t) => {
  const input = `.#.#.#
...##.
#....#
..#...
#.#..#
####..`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 4);
  t.assert.equal(result.second, 7);
});
