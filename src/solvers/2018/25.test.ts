import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./25";

test("2018.25", async (t) => {
  const input = `1,-1,0,1
2,0,-1,0
3,2,-1,0
0,0,3,1
0,0,-1,-1
2,3,-2,0
-2,2,0,0
2,-2,0,-1
1,-1,0,-1
3,2,0,2`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 3);
});
