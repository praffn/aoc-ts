import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./05";

test("2017.05", async (t) => {
  const input = `0
3
0
1
-3`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 5);
  t.assert.equal(result.second, 10);
});
