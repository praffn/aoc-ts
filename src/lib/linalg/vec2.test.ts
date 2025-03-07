import { describe, it } from "node:test";
import {
  add,
  chebyshev,
  equals,
  makeVec2,
  manhattan,
  scale,
  sign,
  sub,
} from "./vec2";

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

  describe("scale", () => {
    it("should scale a vector by a scalar", (t) => {
      const a = makeVec2(3, -6);
      const expected = makeVec2(6, -12);

      t.assert.deepEqual(scale(a, 2), expected);
    });
  });

  describe("cross", () => {
    it("should return the cross product of two vectors", (t) => {
      const tests = [
        [makeVec2(1, 0), makeVec2(0, 1), 1],
        [makeVec2(0, 1), makeVec2(1, 0), -1],
        [makeVec2(2, 2), makeVec2(4, 4), 0],
        [makeVec2(2, 2), makeVec2(-4, -4), 0],
        [makeVec2(3, 5), makeVec2(7, 2), -29],
      ] as const;

      for (const [a, b, expected] of tests) {
        t.assert.equal(a.x * b.y - a.y * b.x, expected);
      }
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

  describe("manhattan", () => {
    it("should return the manhattan distance between two vectors", (t) => {
      const a = makeVec2(3, 6);
      const b = makeVec2(-5, 1);
      t.assert.equal(manhattan(a, b), 13);
    });

    it("should return the manhattan distance between vector and origin", (t) => {
      const a = makeVec2(3, 6);
      t.assert.equal(manhattan(a), 9);
    });
  });

  describe("chebyshev", () => {
    it("should return the chebyshev distance between two vectors", (t) => {
      const a = makeVec2(3, 6);
      const b = makeVec2(-5, 1);
      t.assert.equal(chebyshev(a, b), 8);
    });

    it("should return the chebyshev distance between vector and origin", (t) => {
      const a = makeVec2(3, 6);
      t.assert.equal(chebyshev(a), 6);
    });
  });

  describe("sign", () => {
    it("should return a vector with the sign of each component", (t) => {
      const a = makeVec2(3, -6);
      const b = makeVec2(0, -0);
      const expectedA = makeVec2(1, -1);
      const expectedB = makeVec2(0, 0);

      t.assert.deepEqual(sign(a), expectedA);
      t.assert.deepEqual(sign(b), expectedB);
    });
  });
});
