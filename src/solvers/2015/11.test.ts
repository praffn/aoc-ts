import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./11";

test("2015.11", async (t) => {
  const input = `vzbxkghb`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, "vzbxxyzz");
  t.assert.equal(result.second, "vzcaabcc");
});
