import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./04";

test("2024.04", async (t) => {
  const input = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 18);
  t.assert.equal(result.second, 9);
});
