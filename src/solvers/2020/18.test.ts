import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./18";

test("2020.18", async (t) => {
  const input = `2 * 3 + (4 * 5)
5 + (8 * 3 + 9 + 3 * 4 * 3)
5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))
((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2 `;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 26335);
  t.assert.equal(result.second, 693891);
});
