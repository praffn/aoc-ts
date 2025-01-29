import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./15";

test("2020.15", async (t) => {
  const input = `3,1,2`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader, false, true);

  t.assert.equal(result.first, 1836);
  // we skip second part because it is slow...
});
