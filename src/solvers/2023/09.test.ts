import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./09";

test("2023.09", async (t) => {
  const input = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 114);
  t.assert.equal(result.second, 2);
});
