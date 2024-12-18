import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./19";

test("2016.19", async (t) => {
  const input = `3017957`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 1841611);
  t.assert.equal(result.second, 1423634);
});
