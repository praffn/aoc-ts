import { describe, it } from "node:test";
import { getOr, getOrRun } from "./dicts";

describe("dicts", () => {
  describe("getOr", () => {
    it("should return the value if it exists", (t) => {
      const map = new Map<string, number>();
      map.set("foo", 42);

      t.assert.equal(getOr(map, "foo", 99), 42);
    });

    it("should return the default value if it doesn't exist", (t) => {
      const map = new Map<string, number>();

      t.assert.equal(getOr(map, "foo", 99), 99);
    });
  });

  describe("getOrRun", () => {
    it("should return the value if it exists", (t) => {
      const map = new Map<string, number>();
      map.set("foo", 42);

      t.assert.equal(
        getOrRun(map, "foo", () => 99),
        42
      );
    });

    it("should return the default value if it doesn't exist", (t) => {
      const map = new Map<string, number>();

      t.assert.equal(
        getOrRun(map, "foo", () => 99),
        99
      );
    });
  });
});
