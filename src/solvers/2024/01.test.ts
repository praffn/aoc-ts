import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./01";

const input = `3   4
4   3
2   5
1   3
3   9
3   3`;

test("2024.01 - 1", async (t) => {
  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 11);
  t.assert.equal(result.second, 31);
});
