import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./05";

test("2021.05", async (t) => {
  const input = `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 5);
  t.assert.equal(result.second, 12);
});
