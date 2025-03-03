import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./07";

test("2023.07", async (t) => {
  const input = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 6440);
  t.assert.equal(result.second, 5905);
});
