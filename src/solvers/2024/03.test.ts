import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./03";

const input = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;

test("2024.03", async (t) => {
  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 161);
  t.assert.equal(result.second, 48);
});
