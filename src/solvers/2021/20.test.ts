import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./20";

test("2021.20", async (t) => {
  const input = `######.#..##..######.....#...#.#...#.######.#.#...#..#..#..###.#####.#.####...#.#.#...#.#.#...#####..###.....#.#.....#.#.#..###..#.#.#####..#.....####.##.##..#..##.#.##.##..##.#####.####.#.#....#...#...#...#.#########..#..#####..#.#.###....#.##.###...##.#..#....##.###...#..##.#..#...#.#.#####.####...#.##..##..#.#######...#..##.##.....#..#..#.###...###.######..##.#..##.######....#.##.##...###.##..#.#.#.#########....####.####.#.#...#.#.#..#.#.##.#...#.#..#######..###..##.#..####.###...#.#.#.##.#####.##.###.#.

#..#.
#....
##..#
..#..
..###`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 33);
  t.assert.equal(result.second, 3800);
});
