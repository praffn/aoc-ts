import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./06";

test("2017.06", async (t) => {
  const input = `0\t2\t7\t0`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 5);
  t.assert.equal(result.second, 4);
});
