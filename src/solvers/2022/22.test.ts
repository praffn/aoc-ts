import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./22";

test("2022.22", async (t) => {
  const input = `    ...#...#
    .#......
    #.....#.
    ........
    ....
    ....
    ...#
    ....
...#....
.....#..
.#......
......#.
...#
#...
....
..#.

10R5L5R10L4R5L5`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 6020);
  t.assert.equal(result.second, 1047);
});
