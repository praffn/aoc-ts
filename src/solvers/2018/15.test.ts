import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./15";

const inputs: Array<{
  input: string;
  expectedFirst: number;
  expectedSecond: number;
}> = [
  {
    input: `#######
#G..#E#
#E#E.E#
#G.##.#
#...#E#
#...E.#
#######`,
    expectedFirst: 36334,
    expectedSecond: 29064,
  },
  {
    input: `#######
#E..EG#
#.#G.E#
#E.##E#
#G..#.#
#..E#.#
#######`,
    expectedFirst: 39514,
    expectedSecond: 31284,
  },
  {
    input: `#######
#E.G#.#
#.#G..#
#G.#.G#
#G..#.#
#...E.#
#######`,
    expectedFirst: 27755,
    expectedSecond: 3478,
  },
  {
    input: `#######
#.E...#
#.#..G#
#.###.#
#E#G#G#
#...#G#
#######`,
    expectedFirst: 28944,
    expectedSecond: 6474,
  },
  {
    input: `#########
#G......#
#.E.#...#
#..##..G#
#...##..#
#...#...#
#.G...G.#
#.....G.#
#########`,
    expectedFirst: 18740,
    expectedSecond: 1140,
  },
];

test("2018.15", async (t) => {
  for (const { input, expectedFirst, expectedSecond } of inputs) {
    const lineReader = createLineReaderFromString(input);
    const result = await solver(lineReader);

    t.assert.equal(result.first, expectedFirst);
    t.assert.equal(result.second, expectedSecond);
  }
});
