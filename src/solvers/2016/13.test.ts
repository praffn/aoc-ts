import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./13";

test("2016.13", async (t) => {
  const input = `1362`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 82);
  t.assert.equal(result.second, 138);
});
