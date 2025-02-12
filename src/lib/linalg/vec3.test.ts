import { describe, it } from "node:test";
import {
  scale,
  abs,
  add,
  equals,
  makeVec3,
  manhattan,
  sub,
  lte,
  clamp,
  min,
  max,
} from "./vec3";

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

  describe("abs", () => {
    it("should return the absolute value of a vector", (t) => {
      const a = makeVec3(-3, 6, -1);
      const expected = makeVec3(3, 6, 1);

      t.assert.deepEqual(abs(a), expected);
    });
  });

  describe("scale", () => {
    it("should scale a vector by a scalar", (t) => {
      const a = makeVec3(3, 6, -1);
      const expected = makeVec3(6, 12, -2);

      t.assert.deepEqual(scale(a, 2), expected);
    });
  });

  describe("manhattan", () => {
    it("should return the manhattan distance between two vectors", (t) => {
      const a = makeVec3(3, 6, -1);
      const b = makeVec3(1, 5, 3);

      t.assert.equal(manhattan(a, b), 7);
    });

    it("should return the manhattan distance between a vector and the origin", (t) => {
      const a = makeVec3(3, 6, -1);

      t.assert.equal(manhattan(a), 10);
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

  describe("lte", () => {
    it("should return true if a is less than or equal to b", (t) => {
      const tests = [
        [makeVec3(1, 2, 3), makeVec3(1, 2, 3), true],
        [makeVec3(1, 2, 3), makeVec3(2, 2, 3), true],
        [makeVec3(1, 2, 3), makeVec3(1, 3, 3), true],
        [makeVec3(1, 2, 3), makeVec3(1, 2, 4), true],
        [makeVec3(1, 2, 3), makeVec3(0, 2, 3), false],
        [makeVec3(1, 2, 3), makeVec3(1, 1, 3), false],
      ] as const;

      for (const [a, b, expected] of tests) {
        t.assert.equal(lte(a, b), expected);
      }
    });
  });

  describe("clamp", () => {
    it("should clamp a vector between two vectors", (t) => {
      const v = makeVec3(1, 2, 3);
      const min = makeVec3(0, 1, 2);
      const max = makeVec3(2, 3, 4);
      const expected = makeVec3(1, 2, 3);

      t.assert.deepEqual(clamp(v, min, max), expected);
    });

    it("should clamp a vector between two scalars", (t) => {
      const v = makeVec3(-4, 0, 6);
      const min = -1;
      const max = 3;
      const expected = makeVec3(-1, 0, 3);

      t.assert.deepEqual(clamp(v, min, max), expected);
    });
  });

  describe("min", () => {
    it("should return the minimum of two vectors", (t) => {
      const a = makeVec3(1, 2, 3);
      const b = makeVec3(2, 1, 3);
      const expected = makeVec3(1, 1, 3);

      t.assert.deepEqual(min(a, b), expected);
    });

    it("should return the minimum of a vector and a scalar", (t) => {
      const v = makeVec3(1, 2, 3);
      const s = 2;
      const expected = makeVec3(1, 2, 2);

      t.assert.deepEqual(min(v, s), expected);
    });
  });

  describe("max", () => {
    it("should return the maximum of two vectors", (t) => {
      const a = makeVec3(1, 2, 3);
      const b = makeVec3(2, 1, 3);
      const expected = makeVec3(2, 2, 3);

      t.assert.deepEqual(max(a, b), expected);
    });

    it("should return the maximum of a vector and a scalar", (t) => {
      const v = makeVec3(1, 2, 3);
      const s = 2;
      const expected = makeVec3(2, 2, 3);

      t.assert.deepEqual(max(v, s), expected);
    });
  });
});
