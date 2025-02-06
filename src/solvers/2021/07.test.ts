import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./07";

test("2021.07", async (t) => {
  const input = `16,1,2,0,4,2,7,1,2,14`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 37);
  t.assert.equal(result.second, 168);
});
