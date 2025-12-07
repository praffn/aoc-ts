import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./06";

test("2025.06", async (t) => {
  const input = `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 4277556);
  t.assert.equal(result.second, 3263827);
});
