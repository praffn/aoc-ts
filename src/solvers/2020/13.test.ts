import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./13";

test("2020.13", async (t) => {
  const input = `939
7,13,x,x,59,x,31,19`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 295);
  t.assert.equal(result.second, 1068781n);
});
