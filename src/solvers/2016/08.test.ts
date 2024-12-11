import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./08";

test("2016.08", async (t) => {
  const input = `rect 3x2
rotate column x=1 by 1
rect 3x2
rotate row y=0 by 4
rect 2x2`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 9);
});
