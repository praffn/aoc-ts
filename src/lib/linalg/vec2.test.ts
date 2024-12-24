import { describe, it } from "node:test";
import { add, equals, makeVec2, sub } from "./vec2";

describe("linalg/vec2", () => {
  describe("makeVec2", () => {
    it("should create a new Vec2 given single input", (t) => {
      const vec = makeVec2(42);
      t.assert.deepEqual(vec, { x: 42, y: 42 });
    });

    it("should create a new Vec2 given two inputs", (t) => {
      const vec = makeVec2(42, 99);
      t.assert.deepEqual(vec, { x: 42, y: 99 });
    });
  });

  describe("add", () => {
    it("should add two vectors", (t) => {
      const a = makeVec2(3, 6);
      const b = makeVec2(-5, 1.5);
      const expected = makeVec2(-2, 7.5);

      t.assert.deepEqual(add(a, b), expected);
    });
  });

  describe("sub", () => {
    it("should subtract two vectors", (t) => {
      const a = makeVec2(3, 6);
      const b = makeVec2(-5, 1.5);
      const expected = makeVec2(8, 4.5);

      t.assert.deepEqual(sub(a, b), expected);
    });
  });

  describe("equals", () => {
    it("should return true if two vectors are equal", (t) => {
      const a = makeVec2(3, 6);
      const b = makeVec2(3, 6);
      t.assert.equal(equals(a, b), true);
    });

    it("should return false if two vectors are not equal", (t) => {
      const a = makeVec2(3, 6);
      const b = makeVec2(3, 7);
      t.assert.equal(equals(a, b), false);
    });
  });
});
