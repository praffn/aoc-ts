import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./20";

test("2015.20", async (t) => {
  const input = `420`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 20);
  t.assert.equal(result.second, 18);
});
