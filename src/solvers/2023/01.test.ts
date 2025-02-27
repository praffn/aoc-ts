import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./01";

test("2022.25", async (t) => {
  const input = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen
`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 209);
  t.assert.equal(result.second, 281);
});
