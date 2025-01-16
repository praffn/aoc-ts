import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./04";

test("2019.04", async (t) => {
  const input = `246540-787419`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 1063);
  t.assert.equal(result.second, 686);
});
