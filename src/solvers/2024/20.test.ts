import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./20";

test("2024.20", async (t) => {
  const input = `###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader, false, 64);

  t.assert.equal(result.first, 1);
  t.assert.equal(result.second, 86);
});
