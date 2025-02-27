import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./03";

test("2022.25", async (t) => {
  const input = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 4361);
  t.assert.equal(result.second, 467835);
});
