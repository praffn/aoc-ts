import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./12";

test("2018.12", async (t) => {
  const input = `initial state: #..#####.#.#.##....####..##.#.#.##.##.#####..####.#.##.....#..#.#.#...###..#..###.##.#..##.#.#.....#

.#.## => #
.###. => #
#..#. => .
...## => .
#.##. => #
....# => .
..##. => #
.##.. => .
##..# => .
.#..# => #
#.#.# => .
#.... => .
.#### => #
.##.# => .
..#.. => #
####. => #
#.#.. => .
.#... => .
###.# => .
..### => .
#..## => #
...#. => #
..... => .
###.. => #
#...# => .
..#.# => #
##... => #
##.## => .
##.#. => .
##### => .
.#.#. => #
#.### => #`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 1447);
  t.assert.equal(result.second, 1050000000480);
});
