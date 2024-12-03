import test from "node:test";
import { isNiceString, isNiceStringStrict } from "./05";

test("2015.05", async (t) => {
  const niceStringCandidates = [
    {
      input: "ugknbfddgicrmopn",
      expected: true,
    },
    {
      input: "aaa",
      expected: true,
    },
    {
      input: "jchzalrnumimnmhp",
      expected: false,
    },
    {
      input: "haegwjzuvuyypxyu",
      expected: false,
    },
    {
      input: "dvszwmarrgswjxmb",
      expected: false,
    },
  ];

  for (const { input, expected } of niceStringCandidates) {
    const actual = isNiceString(input);
    t.assert.equal(
      actual,
      expected,
      `expected isNiceString('${input}') to be ${expected}, was ${actual}`
    );
  }

  const niceStringStrictCandidates = [
    {
      input: "qjhvhtzxzqqjkmpb",
      expected: true,
    },
    {
      input: "xxyxx",
      expected: true,
    },
    {
      input: "uurcxstgmygtbstg",
      expected: false,
    },
    {
      input: "ieodomkazucvgmuy",
      expected: false,
    },
  ];

  for (const { input, expected } of niceStringStrictCandidates) {
    const actual = isNiceStringStrict(input);
    t.assert.equal(
      actual,
      expected,
      `expected isNiceStringStrict('${input}') to be ${expected}, was ${actual}`
    );
  }
});
