import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./06";

test("2024.06", async (t) => {
  const input = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 41);
  t.assert.equal(result.second, 6);
});
