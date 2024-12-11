import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./10";

test("2024.10", async (t) => {
  const input = `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`;
  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);
  t.assert.equal(result.first, 36);
  t.assert.equal(result.second, 81);
});
