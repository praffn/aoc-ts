import { describe, it } from "node:test";
import { mod } from "./math";

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
});
