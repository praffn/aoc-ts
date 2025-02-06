import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./09";

test("2021.09", async (t) => {
  const input = `2199943210
3987894921
9856789892
8767896789
9899965678`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 15);
  t.assert.equal(result.second, 1134);
});
