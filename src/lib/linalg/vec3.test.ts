import { describe, it } from "node:test";
import { add, equals, makeVec3, sub } from "./vec3";

describe("linalg/vec3", () => {
  describe("makeVec3", () => {
    it("should create a new Vec3 given single input", (t) => {
      const vec = makeVec3(42);
      t.assert.deepEqual(vec, { x: 42, y: 42, z: 42 });
    });

    it("should create a new Vec3 given three inputs", (t) => {
      const vec = makeVec3(42, 99, -1);
      t.assert.deepEqual(vec, { x: 42, y: 99, z: -1 });
    });
  });

  describe("add", () => {
    it("should add two vectors", (t) => {
      const a = makeVec3(3, 6, -1);
      const b = makeVec3(-5, 1.5, 0);
      const expected = makeVec3(-2, 7.5, -1);

      t.assert.deepEqual(add(a, b), expected);
    });
  });

  describe("sub", () => {
    it("should subtract two vectors", (t) => {
      const a = makeVec3(3, 6, -1);
      const b = makeVec3(-5, 1.5, 0);
      const expected = makeVec3(8, 4.5, -1);

      t.assert.deepEqual(sub(a, b), expected);
    });
  });

  describe("equals", () => {
    it("should return true if two vectors are equal", (t) => {
      const a = makeVec3(3, 6, -1);
      const b = makeVec3(3, 6, -1);
      t.assert.equal(equals(a, b), true);
    });

    it("should return false if two vectors are not equal", (t) => {
      const a = makeVec3(3, 6, -1);
      const b = makeVec3(3, 7, -1);
      t.assert.equal(equals(a, b), false);
    });
  });
});
