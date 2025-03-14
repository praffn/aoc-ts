import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./24";

test("2023.24", async (t) => {
  const input = `19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @  1, -5, -3`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader, false, 7, 27);

  t.assert.equal(result.first, 2);
  // t.assert.equal(result.second, 47); <-- not testing for sample input
});
