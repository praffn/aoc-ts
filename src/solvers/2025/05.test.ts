import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./05";

test("2025.05", async (t) => {
  const input = `3-5
10-14
16-20
12-18

1
5
8
11
17
32`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 3);
  t.assert.equal(result.second, 14);
});
