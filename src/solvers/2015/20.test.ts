import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./20";

test("2015.20", async (t) => {
  const input = ``;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 0);
  t.assert.equal(result.second, 0);
});