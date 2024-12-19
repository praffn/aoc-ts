import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./19";

test("2024.19", async (t) => {
  const input = `r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 6);
  t.assert.equal(result.second, 16);
});
