import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./14";

test("2022.14", async (t) => {
  const input = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 24);
  t.assert.equal(result.second, 93);
});
