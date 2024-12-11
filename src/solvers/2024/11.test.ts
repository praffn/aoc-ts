import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./11";

test("2024.11", async (t) => {
  const input = `4022724 951333 0 21633 5857 97 702 6`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 211306);
  t.assert.equal(result.second, 250783680217283);
});
