import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./04";

test("2022.04", async (t) => {
  const input = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 2);
  t.assert.equal(result.second, 4);
});
