import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./03";

test("2021.03", async (t) => {
  const input = `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 198);
  t.assert.equal(result.second, 230);
});
