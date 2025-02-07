import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./11";

test("2021.11", async (t) => {
  const input = `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 1656);
  t.assert.equal(result.second, 195);
});
