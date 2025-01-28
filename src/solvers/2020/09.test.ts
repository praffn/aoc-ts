import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./09";

test("2020.09", async (t) => {
  const input = `35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader, false, 5);

  t.assert.equal(result.first, 127);
  t.assert.equal(result.second, 62);
});
