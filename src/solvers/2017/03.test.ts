import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./03";

test("2017.03", async (t) => {
  const input = `312051`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 430);
  t.assert.equal(result.second, 312453);
});
