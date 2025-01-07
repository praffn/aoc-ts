import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./08";

test("2018.08", async (t) => {
  const input = `2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 138);
  t.assert.equal(result.second, 66);
});
