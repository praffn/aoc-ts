import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./04";

const inputs = [
  ["abcdef", 609043, 6742839],
  ["pqrstuv", 1048970, 5714438],
] as const;

test("2015.04", async (t) => {
  t.skip("This test is skipped because it takes too long to run");
  return;

  for (const [input, expectedFirst, expectedSecond] of inputs) {
    const lineReader = createLineReaderFromString(input);
    const result = await solver(lineReader);

    t.assert.equal(result.first, expectedFirst);
    t.assert.equal(result.second, expectedSecond);
  }
});
