import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./03";

test("2018.03", async (t) => {
  const input = `#1 @ 1,3: 4x4
#2 @ 3,1: 4x4
#3 @ 5,5: 2x2`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 4);
  t.assert.equal(result.second, 3);
});
