import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./06";

test("2023.06", async (t) => {
  const input = `Time:      7  15   30
Distance:  9  40  200`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 288);
  t.assert.equal(result.second, 71503);
});
