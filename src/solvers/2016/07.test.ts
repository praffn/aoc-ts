import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./07";

test("2016.07", async (t) => {
  const input = `abba[mnop]qrst
abcd[bddb]xyyx
aaaa[qwer]tyui
ioxxoj[asdfgh]zxcvbn
aba[bab]xyz
aba[xyz]bab`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 2);
  t.assert.equal(result.second, 1);
});
