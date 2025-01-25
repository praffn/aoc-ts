import { describe, it } from "node:test";
import { gcd, lcm, mod, modexp } from "./math";

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
        [2n, 3n, 5n, 3n],
        [5n, 0n, 7n, 1n], // <- power of zero
        [6n, 1n, 13n, 6n], // <- power of one
        [4n, 5n, 1n, 0n], // <- mod 1
        [987654321n, 123456789n, 1000000007n, 379110096n], // <- large numbers
        [7n, 4n, 7n, 0n], // <- base = modulo
        [3n, 7n, 11n, 9n], // <- prime modulo
        [-3n, 3n, 7n, 1n], // <- negative base
        [0n, 5n, 9n, 0n], // <- base = 0
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
});
