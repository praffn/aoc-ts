import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./24";

test("2015.24", async (t) => {
  const input = `1
2
3
4
5
7
8
9
10
11`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 99);
  t.assert.equal(result.second, 44);
});
