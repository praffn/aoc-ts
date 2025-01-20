import { describe, it } from "node:test";
import { StructuralSet } from "./structural-set";
import { key, makeVec2 } from "../linalg/vec2";

describe("StructuralSet", () => {
  describe("add", () => {
    it("should add a value to the set", (t) => {
      const set = new StructuralSet(key);
      set.add(makeVec2(1, 2));
      set.add(makeVec2(3, 4));

      t.assert.equal(set.size, 2);
      t.assert.equal(set.has(makeVec2(1, 2)), true);
      t.assert.equal(set.has(makeVec2(3, 4)), true);
    });

    it("should not add the same value twice", (t) => {
      const set = new StructuralSet(key);
      set.add(makeVec2(1, 2));
      set.add(makeVec2(1, 2));

      t.assert.equal(set.size, 1);
    });
  });

  describe("has", (t) => {
    it("should return true if the value is in the set", (t) => {
      const set = new StructuralSet(key);
      set.add(makeVec2(1, 2));

      t.assert.equal(set.has(makeVec2(1, 2)), true);
    });

    it("should return false if the value is not in the set", (t) => {
      const set = new StructuralSet(key);
      set.add(makeVec2(1, 2));

      t.assert.equal(set.has(makeVec2(3, 4)), false);
    });
  });

  describe("delete", () => {
    it("should remove a value from the set", (t) => {
      const set = new StructuralSet(key);
      set.add(makeVec2(1, 2));
      const didDelete = set.delete(makeVec2(1, 2));

      t.assert.equal(didDelete, true);
      t.assert.equal(set.size, 0);
    });

    it("should return false if the value is not in the set", (t) => {
      const set = new StructuralSet(key);
      const didDelete = set.delete(makeVec2(1, 2));

      t.assert.equal(didDelete, false);
    });
  });

  describe("clear", () => {
    it("should remove all values from the set", (t) => {
      const set = new StructuralSet(key);
      set.add(makeVec2(1, 2));
      set.add(makeVec2(3, 4));
      set.clear();

      t.assert.equal(set.size, 0);
    });
  });
});
