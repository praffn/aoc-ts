import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./07";

test("2024.07", async (t) => {
  const input = `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 3749);
  t.assert.equal(result.second, 11387);
});
