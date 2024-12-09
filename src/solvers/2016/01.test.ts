import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./01";

test("2016.01", async (t) => {
  const input = `R8, R4, R4, R8`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 8);
  t.assert.equal(result.second, 4);
});
