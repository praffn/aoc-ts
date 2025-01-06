import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./02";

test("2018.02", async (t) => {
  const input = `abcdef
bababc
abbcde
abcccd
aabcdd
abcdee
ababab`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 12);
  t.assert.equal(result.second, "abcde");
});
