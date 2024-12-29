import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./13";

test("2017.13", async (t) => {
  const input = `0: 3
1: 2
4: 4
6: 4`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 24);
  t.assert.equal(result.second, 10);
});
