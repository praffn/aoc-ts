import { describe, it } from "node:test";
import { intersection, union } from "./sets";

describe("sets", () => {
  describe("union", () => {
    it("should return the union of two sets", (t) => {
      const a = new Set([1, 2, 3]);
      const b = new Set([2, 3, 4]);
      const actual = union(a, b);
      const expected = new Set([1, 2, 3, 4]);
      t.assert.deepEqual(actual, expected);
    });
  });

  describe("intersection", () => {
    it("should return the intersection of two sets", (t) => {
      const a = new Set([1, 2, 3]);
      const b = new Set([2, 3, 4]);
      const actual = intersection(a, b);
      const expected = new Set([2, 3]);
      t.assert.deepEqual(actual, expected);
    });
  });
});
