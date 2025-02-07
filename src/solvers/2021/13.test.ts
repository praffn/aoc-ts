import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./13";

test("2021.13", async (t) => {
  const input = `6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 17);
});
