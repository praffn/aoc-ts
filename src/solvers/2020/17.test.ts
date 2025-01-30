import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./17";

test("2020.17", async (t) => {
  const input = `.#.
..#
###`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 112);
  t.assert.equal(result.second, 848);
});
