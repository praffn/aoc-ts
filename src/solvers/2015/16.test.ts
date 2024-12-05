import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./16";

test("2015.16", async (t) => {
  const input = `Sue 4: goldfish: 10, akitas: 2, perfumes: 9
Sue 5: cars: 5, perfumes: 6, akitas: 9
Sue 6: goldfish: 10, cats: 9, cars: 8
Sue 40: vizslas: 0, cats: 7, akitas: 0
Sue 41: cars: 9, trees: 10, perfumes: 8
Sue 240: goldfish: 9, trees: 1, perfumes: 1
Sue 241: cars: 2, pomeranians: 1, samoyeds: 2
Sue 242: akitas: 2, trees: 3, cars: 4
Sue 42: akitas: 4, trees: 2, goldfish: 3
Sue 43: goldfish: 1, cats: 1, akitas: 8`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 4);
  t.assert.equal(result.second, 7);
});
