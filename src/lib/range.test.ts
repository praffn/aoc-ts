import { describe, it } from "node:test";
import { Range } from "./range";

describe("range", () => {
  describe("contains", () => {
    it("should return true if the value is within the range", (t) => {
      const range = new Range(2, 4);
      t.assert.equal(range.contains(2), true);
      t.assert.equal(range.contains(3), true);
    });

    it("should return false if the value is not within the range", (t) => {
      const range = new Range(2, 4);

      t.assert.equal(range.contains(1000), false);
      t.assert.equal(range.contains(-100), false);
      t.assert.equal(range.contains(4), false);
    });
  });

  describe("overlaps", () => {
    it("should return true if the given range overlaps with this range", (t) => {
      const range = new Range(2, 4);
      const other = new Range(3, 5);

      t.assert.equal(range.overlaps(other), true);
    });

    it("should return false if the given range does not overlap with this range", (t) => {
      const range = new Range(2, 4);
      const other = new Range(5, 6);

      t.assert.equal(range.overlaps(other), false);
    });
  });

  describe("fullyContains", () => {
    it("should return true if the given range is fully contained within this range", (t) => {
      const range = new Range(1, 9);
      const other = new Range(3, 4);

      t.assert.equal(range.fullyContains(other), true);
    });

    it("should return true for itself", (t) => {
      const range = new Range(1, 9);

      t.assert.equal(range.fullyContains(range), true);
    });

    it("should return false if the given range is not fully contained within this range", (t) => {
      const range = new Range(1, 9);
      const other = new Range(0, 5);

      t.assert.equal(range.fullyContains(other), false);
    });
  });

  describe("touches", () => {
    it("should return true if and only if two ranges touch eachother", (t) => {
      const rangeA = new Range(1, 3);
      const rangeB = new Range(3, 5);

      t.assert.equal(rangeA.touches(rangeB), true);
      t.assert.equal(rangeB.touches(rangeA), true);
    });

    it("should not return true if two ranges overlap", (t) => {
      const rangeA = new Range(1, 3);
      const rangeB = new Range(2, 4);

      t.assert.equal(rangeA.touches(rangeB), false);
      t.assert.equal(rangeB.touches(rangeA), false);
    });

    it("should not return true if two ranges are not touching", (t) => {
      const rangeA = new Range(1, 3);
      const rangeB = new Range(4, 6);

      t.assert.equal(rangeA.touches(rangeB), false);
      t.assert.equal(rangeB.touches(rangeA), false);
    });
  });

  describe("merge", () => {
    it("should merge two ranges that overlap", (t) => {
      const rangeA = new Range(1, 3);
      const rangeB = new Range(2, 4);

      t.assert.equal(rangeA.merge(rangeB).equals(new Range(1, 4)), true);
    });

    it("should merge two ranges that touch", (t) => {
      const rangeA = new Range(1, 3);
      const rangeB = new Range(3, 5);

      t.assert.equal(rangeA.merge(rangeB).equals(new Range(1, 5)), true);
    });
  });
});
