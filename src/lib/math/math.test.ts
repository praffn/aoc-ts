import { describe, it } from "node:test";
import { divmod, gcd, lcm, mod, modexp } from "./math";

describe("lib/math/math", () => {
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

  describe("lcm", () => {
    it("should return the least common multiple", (t) => {
      const tests = [
        [4, 6, 12],
        [1, 5, 5],
        [7, 13, 91],
        [0, 8, 0],
        [9, 9, 9],
        [4, 16, 16],
        [-3, -7, 21],
        [-4, 6, 12],
        [123456, 789012, 8117355456],
      ];

      for (const [a, b, expected] of tests) {
        const actual = lcm(a, b);
        t.assert.equal(
          actual,
          expected,
          `expected lcm(${a}, ${b}) to be ${expected}, got ${actual}`
        );
      }
    });
  });

  describe("modexp", () => {
    it("should return the modular exponentiation", (t) => {
      const tests = [
        [2, 3, 5, 3],
        [5, 0, 7, 1], // <- power of zero
        [6, 1, 13, 6], // <- power of one
        [4, 5, 1, 0], // <- mod 1
        [7, 4, 7, 0], // <- base = modulo
        [3, 7, 11, 9], // <- prime modulo
        [-3, 3, 7, 1], // <- negative base
        [0, 5, 9, 0], // <- base = 0
      ] as const;

      for (const [base, exp, mod, expected] of tests) {
        const actual = modexp(base, exp, mod);
        t.assert.equal(
          actual,
          expected,
          `expected modexp(${base}, ${exp}, ${mod}) to be ${expected}, got ${actual}`
        );
      }
    });
  });

  describe("divmod", () => {
    it("should return the floored division and the remainder", (t) => {
      const tests = [
        { a: 10, b: 3, expected: [3, 1] },
        { a: 20, b: 5, expected: [4, 0] },
        { a: 7, b: 2, expected: [3, 1] },
        { a: -10, b: 3, expected: [-4, 2] },
        { a: 10, b: -3, expected: [-4, -2] },
        { a: -10, b: -3, expected: [3, -1] },
        { a: 0, b: 5, expected: [0, 0] },
        { a: 10, b: 1, expected: [10, 0] },
        { a: 10, b: 10, expected: [1, 0] },
      ];

      for (const { a, b, expected } of tests) {
        const actual = divmod(a, b);
        t.assert.deepEqual(
          actual,
          expected,
          `expected divmod(${a}, ${b}) to be ${expected}, got ${actual}`
        );
      }
    });
  });
});
