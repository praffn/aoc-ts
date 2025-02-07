import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./14";

test("2021.14", async (t) => {
  const input = `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 1588);
  t.assert.equal(result.second, 2188189693529);
});
