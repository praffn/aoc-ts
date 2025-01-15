import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./22";

test("2018.22", async (t) => {
  const input = `depth: 510
target: 10,10`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 114);
  t.assert.equal(result.second, 45);
});
