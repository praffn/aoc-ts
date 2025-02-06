import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./01";

test("2021.01", async (t) => {
  const input = `199
200
208
210
200
207
240
269
260
263`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 7);
  t.assert.equal(result.second, 5);
});
