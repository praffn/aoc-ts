import { describe, it } from "node:test";
import { add, equals, makeVec4, sub } from "./vec4";

describe("linalg/vec4", () => {
  describe("makeVec4", () => {
    it("should create a new Vec4 given single input", (t) => {
      const vec = makeVec4(42);
      t.assert.deepEqual(vec, { x: 42, y: 42, z: 42, w: 42 });
    });

    it("should create a new Vec4 given four inputs", (t) => {
      const vec = makeVec4(42, 99, -1, -99);
      t.assert.deepEqual(vec, { x: 42, y: 99, z: -1, w: -99 });
    });
  });

  describe("add", () => {
    it("should add two vectors", (t) => {
      const a = makeVec4(3, 6, -1, 43);
      const b = makeVec4(-5, 1.5, 0, -42);
      const expected = makeVec4(-2, 7.5, -1, 1);

      t.assert.deepEqual(add(a, b), expected);
    });
  });

  describe("sub", () => {
    it("should subtract two vectors", (t) => {
      const a = makeVec4(3, 6, -1, 43);
      const b = makeVec4(-5, 1.5, 0, -42);
      const expected = makeVec4(8, 4.5, -1, 85);

      t.assert.deepEqual(sub(a, b), expected);
    });
  });

  describe("equals", () => {
    it("should return true if two vectors are equal", (t) => {
      const a = makeVec4(3, 6, -1, 42);
      const b = makeVec4(3, 6, -1, 42);
      t.assert.equal(equals(a, b), true);
    });

    it("should return false if two vectors are not equal", (t) => {
      const a = makeVec4(3, 6, -1, 42);
      const b = makeVec4(3, 7, -1, 42);
      t.assert.equal(equals(a, b), false);
    });
  });
});
