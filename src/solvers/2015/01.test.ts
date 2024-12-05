import test, { describe } from "node:test";
import { climb } from "./01";

test("2015.01", (t) => {
  const cases = [
    ["(())", 0, -1],
    ["()()", 0, -1],
    ["(((", 3, -1],
    ["(()(()(", 3, -1],
    ["))(((((", 3, 1],
    ["())", -1, 3],
    ["))(", -1, 1],
    [")))", -3, 1],
    [")())())", -3, 1],
    [")", -1, 1],
    ["()())", -1, 5],
  ] as const;

  for (const [input, ...expected] of cases) {
    const actual = climb(input);
    t.assert.deepEqual(
      actual,
      expected,
      `climb('${input}') => ${expected} (actual: ${actual})`
    );
  }
});
