import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./02";

const input = `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`;

test("2024.01 - 1", async (t) => {
  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 2);
  t.assert.equal(result.second, 4);
});
