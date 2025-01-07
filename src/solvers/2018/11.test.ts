import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./11";

test("2018.11", async (t) => {
  const input = `18`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, "33,45");
  t.assert.equal(result.second, "90,269,16");
});
