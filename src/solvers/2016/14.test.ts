import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./14";

test("2016.14", async (t) => {
  t.skip("skipped because it's slow");
  return;
  const input = `ahsbgdzn`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 23890);
  t.assert.equal(result.second, 22696);
});
