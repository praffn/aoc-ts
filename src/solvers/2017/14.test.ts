import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./14";

test("2017.14", async (t) => {
  const input = `oundnydw`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 8106);
  t.assert.equal(result.second, 1164);
});
