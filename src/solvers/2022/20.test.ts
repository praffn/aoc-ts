import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./20";

test("2022.20", async (t) => {
  const input = `1
2
-3
3
-2
0
4`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 3);
  t.assert.equal(result.second, 1623178306);
});
