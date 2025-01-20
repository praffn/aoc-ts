import { describe, it } from "node:test";
import { gcd, mod } from "./math";

describe("lib/math", () => {
  describe("mod", () => {
    it("should return floored division modulo", (t) => {
      const tests = [
        [7, 3, 1],
        [7, -3, -2],
        [-7, 3, 2],
        [-7, -3, -1],
      ] as const;

      for (const [a, b, expected] of tests) {
        const actual = mod(a, b);
        t.assert.equal(
          actual,
          expected,
          `expected mod(${a}, ${b}) to be ${expected}, got ${actual}`
        );
      }
    });
  });

  describe("gcd", () => {
    it("should return the greatest common divisor", (t) => {
      const tests = [
        [48, 18, 6],
        [18, 48, 6],
        [48, 0, 48],
        [0, 48, 48],
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 1],
        [7, 3, 1],
        [13, 7, 1],
      ] as const;

      for (const [a, b, expected] of tests) {
        const actual = gcd(a, b);
        t.assert.equal(
          actual,
          expected,
          `expected gcd(${a}, ${b}) to be ${expected}, got ${actual}`
        );
      }
    });
  });
});
