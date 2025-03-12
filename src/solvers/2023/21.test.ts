import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./21";

test("2023.21", async (t) => {
  const input = `...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 605);
  t.assert.equal(result.second, 528192899606863);
});
