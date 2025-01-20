import { describe, it } from "node:test";
import { StructuralMap } from "./structural-map";
import { key, makeVec2, type Vec2 } from "../linalg/vec2";

describe("StructuralMap", () => {
  describe("set", () => {
    it("should set a value for a key", (t) => {
      const map = new StructuralMap(key);
      map.set(makeVec2(2, 42), "foo");

      t.assert.equal(map.get(makeVec2(2, 42)), "foo");
    });

    it("should overwrite a value for a key", (t) => {
      const map = new StructuralMap(key);
      map.set(makeVec2(2, 42), "foo");
      map.set(makeVec2(2, 42), "bar");

      t.assert.equal(map.size, 1);
      t.assert.equal(map.get(makeVec2(2, 42)), "bar");
    });
  });

  describe("getOrDefault", () => {
    it("should return the value of a key if it exists", (t) => {
      const map = new StructuralMap(key);
      map.set(makeVec2(2, 42), "foo");

      t.assert.equal(map.getOrDefault(makeVec2(2, 42), "bar"), "foo");
    });

    it("should return the default value if the key does not exist", (t) => {
      const map = new StructuralMap(key);

      t.assert.equal(map.getOrDefault(makeVec2(2, 42), "bar"), "bar");
    });

    it("should return the value the default factory if the key does not exists", (t) => {
      const map = new StructuralMap(key);

      t.assert.equal(
        map.getOrDefault(makeVec2(2, 42), () => "bar"),
        "bar"
      );
    });
  });

  describe("update", () => {
    it("should update the value of a key if it exists", (t) => {
      const map = new StructuralMap<Vec2, number>(key);
      map.set(makeVec2(2, 42), 42);
      map.update(makeVec2(2, 42), (value) => value + 1);

      t.assert.equal(map.get(makeVec2(2, 42)), 43);
    });

    it("should not do anything if the key does not exist and no default value is provided", (t) => {
      const map = new StructuralMap<Vec2, number>(key);
      map.update(makeVec2(2, 42), (value) => value + 1);

      t.assert.equal(map.get(makeVec2(2, 42)), undefined);
    });

    it("should set the default value if the key does not exist and a default value is provided", (t) => {
      const map = new StructuralMap<Vec2, number>(key);
      map.update(makeVec2(2, 42), (value) => value + 1, 0);

      t.assert.equal(map.get(makeVec2(2, 42)), 1);
    });
  });

  describe("has", () => {
    it("should return true if the key exists", (t) => {
      const map = new StructuralMap(key);
      map.set(makeVec2(2, 42), "foo");

      t.assert.equal(map.has(makeVec2(2, 42)), true);
    });

    it("should return false if the key does not exist", (t) => {
      const map = new StructuralMap(key);

      t.assert.equal(map.has(makeVec2(2, 42)), false);
    });
  });

  describe("delete", () => {
    it("should remove a key from the map", (t) => {
      const map = new StructuralMap(key);
      map.set(makeVec2(2, 42), "foo");
      const didDelete = map.delete(makeVec2(2, 42));

      t.assert.equal(didDelete, true);
      t.assert.equal(map.get(makeVec2(2, 42)), undefined);
    });

    it("should return false if the key was not removed", (t) => {
      const map = new StructuralMap(key);
      const didDelete = map.delete(makeVec2(2, 42));

      t.assert.equal(didDelete, false);
    });
  });

  describe("clear", () => {
    it("should remove all keys from the map", (t) => {
      const map = new StructuralMap(key);
      map.set(makeVec2(2, 42), "foo");
      map.set(makeVec2(3, 43), "bar");
      map.clear();

      t.assert.equal(map.size, 0);
    });
  });

  describe("increment", () => {
    it("should increment the value of a key", (t) => {
      const map = new StructuralMap<Vec2, number>(key);
      map.set(makeVec2(2, 42), 42);
      const newAmount = map.increment(makeVec2(2, 42));

      t.assert.equal(newAmount, 43);
      t.assert.equal(map.get(makeVec2(2, 42)), 43);
    });

    it("should increment the value of a key by a given amount", (t) => {
      const map = new StructuralMap<Vec2, number>(key);
      map.set(makeVec2(2, 42), 42);
      const newAmount = map.increment(makeVec2(2, 42), 10);

      t.assert.equal(newAmount, 52);
      t.assert.equal(map.get(makeVec2(2, 42)), 52);
    });

    it("should set the value to the amount if the key does not exist", (t) => {
      const map = new StructuralMap<Vec2, number>(key);
      const newAmount = map.increment(makeVec2(2, 42), 10);

      t.assert.equal(newAmount, 10);
      t.assert.equal(map.get(makeVec2(2, 42)), 10);
    });
  });
});
