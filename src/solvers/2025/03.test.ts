import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./03";

test("2025.03", async (t) => {
  const input = `987654321111111
811111111111119
234234234234278
818181911112111`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 357);
  t.assert.equal(result.second, 3121910778619);
});
