import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./06";

test("2021.06", async (t) => {
  const input = `3,4,3,1,2`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 5934);
  t.assert.equal(result.second, 26984457539);
});
