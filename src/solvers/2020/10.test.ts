import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./10";

test("2020.10", async (t) => {
  const input = `16
10
15
5
1
11
7
19
6
12
4`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 35);
  t.assert.equal(result.second, 8);
});
