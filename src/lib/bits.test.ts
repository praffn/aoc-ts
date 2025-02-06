import { describe, it } from "node:test";
import { bitClear, bitGet, bitSet, bitToggle, popcount } from "./bits";

describe("lib/bits", () => {
  describe("bitSet", () => {
    it("should set the bit at the given position", (t) => {
      const tests = [
        [0b0000, 0, 0b0001],
        [0b0110, 0, 0b0111],
        [0b1111, 0, 0b1111],
        [0b0000, 3, 0b1000],
      ] as const;

      for (const [n, i, expected] of tests) {
        t.assert.equal(
          bitSet(n, i),
          expected,
          `bitSet(${n.toString(2)}, ${i}) should be ${expected.toString(2)}`
        );
      }
    });
  });

  describe("bitClear", () => {
    it("should clear the bit at the given position", (t) => {
      const tests = [
        [0b0001, 0, 0b0000],
        [0b0111, 0, 0b0110],
        [0b1111, 0, 0b1110],
        [0b1000, 3, 0b0000],
        [0b1010, 0, 0b1010],
      ] as const;

      for (const [n, i, expected] of tests) {
        t.assert.equal(
          bitClear(n, i),
          expected,
          `bitClear(${n.toString(2)}, ${i}) should be ${expected.toString(2)}`
        );
      }
    });
  });

  describe("bitToggle", () => {
    it("should toggle the bit at the given position", (t) => {
      const tests = [
        [0b0000, 0, 0b0001],
        [0b0110, 0, 0b0111],
        [0b1111, 0, 0b1110],
        [0b1000, 3, 0b0000],
        [0b1010, 0, 0b1011],
      ] as const;

      for (const [n, i, expected] of tests) {
        t.assert.equal(
          bitToggle(n, i),
          expected,
          `bitToggle(${n.toString(2)}, ${i}) should be ${expected.toString(2)}`
        );
      }
    });
  });

  describe("bitGet", (t) => {
    it("should return true if the bit at the given position is set", (t) => {
      const tests = [
        [0b0001, 0, true],
        [0b0110, 0, false],
        [0b1111, 0, true],
        [0b1000, 3, true],
        [0b1010, 0, false],
      ] as const;

      for (const [n, i, expected] of tests) {
        t.assert.equal(
          bitGet(n, i),
          expected,
          `bitGet(${n.toString(2)}, ${i}) should be ${expected}`
        );
      }
    });
  });

  describe("popcount", (t) => {
    it("should return the number of set bits", (t) => {
      const tests = [
        [0b0000, 0],
        [0b0001, 1],
        [0b0110, 2],
        [0b1111, 4],
        [0b1000, 1],
        [0b1010, 2],
      ] as const;

      for (const [n, expected] of tests) {
        t.assert.equal(
          popcount(n),
          expected,
          `popcount(${n.toString(2)}) should be ${expected}`
        );
      }
    });
  });
});
