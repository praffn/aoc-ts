import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./18";

test("2022.18", async (t) => {
  const input = `2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 64);
  t.assert.equal(result.second, 58);
});
