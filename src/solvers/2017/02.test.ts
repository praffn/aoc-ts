import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./02";

test("2017.02", async (t) => {
  const input = `5	9	2	8
9	4	7	3
3	8	6	5`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 18);
  t.assert.equal(result.second, 9);
});
