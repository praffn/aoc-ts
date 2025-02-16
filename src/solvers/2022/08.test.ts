import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./08";

test("2022.08", async (t) => {
  const input = `30373
25512
65332
33549
35390`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 21);
  t.assert.equal(result.second, 8);
});
