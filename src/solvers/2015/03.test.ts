import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./03";

const inputs = [
  [">", 2, 2],
  ["^>v<", 4, 3],
  ["^v^v^v^v^v", 2, 11],
  ["^v", 2, 3],
] as const;

test("2015.03", async (t) => {
  for (const [input, expectedFirst, expectedSecond] of inputs) {
    const lineReader = createLineReaderFromString(input);
    const result = await solver(lineReader);

    t.assert.equal(result.first, expectedFirst);
    t.assert.equal(result.second, expectedSecond);
  }
});
