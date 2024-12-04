import test from "node:test";
import { lookAndSay } from "./10";

test("2015.10", async (t) => {
  const tests = [
    ["1", "11"],
    ["11", "21"],
    ["21", "1211"],
    ["1211", "111221"],
    ["111221", "312211"],
  ];

  for (const [input, expected] of tests) {
    const actual = lookAndSay(input);
    t.assert.equal(actual, expected);
  }
});
