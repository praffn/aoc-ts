import { describe, it } from "node:test";
import { Grid2D } from "./grid2d";

describe("Grid2D", () => {
  describe("constructor", () => {
    it("should create empty grid with width and height", (t) => {
      const grid = new Grid2D(3, 5);
      t.assert.equal(grid.width, 3);
      t.assert.equal(grid.height, 5);
    });

    it("should create a grid with a fill value", (t) => {
      const grid = new Grid2D(3, 3, "foo");
      t.assert.equal(grid.at(0, 0), "foo");
      t.assert.equal(grid.at(1, 1), "foo");
      t.assert.equal(grid.at(2, 2), "foo");
    });

    it("should create a grid with a fill function", (t) => {
      const grid = new Grid2D(3, 3, (x, y) => `${x},${y}`);

      t.assert.equal(grid.at(0, 0), "0,0");
      t.assert.equal(grid.at(1, 0), "1,0");
      t.assert.equal(grid.at(2, 2), "2,2");
    });
  });

  describe("from2DArray", (t) => {
    it("should construct valid grid", (t) => {
      const grid = Grid2D.from2DArray([
        ["a", "b", "c"],
        ["d", "e", "f"],
        ["g", "h", "i"],
      ]);

      t.assert.equal(grid.width, 3);
      t.assert.equal(grid.height, 3);
      t.assert.equal(grid.at(0, 0), "a");
      t.assert.equal(grid.at(1, 1), "e");
      t.assert.equal(grid.at(2, 2), "i");
    });
  });

  describe("at", () => {
    it("should return the value at the given coordinates", (t) => {
      const grid = new Grid2D<string>(3, 3);
      grid.set(1, 1, "foo");
      t.assert.equal(grid.at(1, 1), "foo");
    });
  });

  describe("isValidPosition", () => {
    it("should return true if the position is within the grid", (t) => {
      const grid = new Grid2D<string>(3, 3);
      t.assert.equal(grid.isValidPosition(1, 1), true);
    });

    it("should return false if the position is outside the grid", (t) => {
      const grid = new Grid2D<string>(3, 3);
      t.assert.equal(grid.isValidPosition(3, 3), false);
    });
  });

  describe("neighbors", () => {
    const grid = Grid2D.from2DArray([
      ["a", "b", "c"],
      ["d", "e", "f"],
      ["g", "h", "i"],
    ]);

    it("should return 4 neighbors for non-edge cell", (t) => {
      const actual = Array.from(grid.neighbors(1, 1)).toSorted();
      t.assert.deepEqual(actual, [
        ["b", 1, 0],
        ["d", 0, 1],
        ["f", 2, 1],
        ["h", 1, 2],
      ]);
    });

    it("should return 3 neighbors for edge cell", (t) => {
      const actual = Array.from(grid.neighbors(1, 0)).toSorted();
      t.assert.deepEqual(actual, [
        ["a", 0, 0],
        ["c", 2, 0],
        ["e", 1, 1],
      ]);
    });

    it("should return 2 neighbors for corner cell", (t) => {
      const actual = Array.from(grid.neighbors(0, 0)).toSorted();
      t.assert.deepEqual(actual, [
        ["b", 1, 0],
        ["d", 0, 1],
      ]);
    });
  });

  describe("neighborsWithDiagonals", () => {
    const grid = Grid2D.from2DArray([
      ["a", "b", "c"],
      ["d", "e", "f"],
      ["g", "h", "i"],
    ]);

    it("should return 8 neighbors for non-edge cell", (t) => {
      const actual = Array.from(grid.neighborsWithDiagonals(1, 1)).toSorted();
      t.assert.deepEqual(actual, [
        ["a", 0, 0],
        ["b", 1, 0],
        ["c", 2, 0],
        ["d", 0, 1],
        ["f", 2, 1],
        ["g", 0, 2],
        ["h", 1, 2],
        ["i", 2, 2],
      ]);
    });

    it("should return 6 neighbors edge cell", (t) => {
      const actual = Array.from(grid.neighborsWithDiagonals(1, 0)).toSorted();
      t.assert.deepEqual(actual, [
        ["a", 0, 0],
        ["c", 2, 0],
        ["d", 0, 1],
        ["e", 1, 1],
        ["f", 2, 1],
      ]);
    });

    it("should return 3 neighbors corner cell", (t) => {
      const actual = Array.from(grid.neighborsWithDiagonals(0, 0)).toSorted();
      t.assert.deepEqual(actual, [
        ["b", 1, 0],
        ["d", 0, 1],
        ["e", 1, 1],
      ]);
    });
  });

  describe("[Symbol.iterator]", () => {
    it("returns an iterator over the grid's values and positions", (t) => {
      const grid = Grid2D.from2DArray([
        ["a", "b", "c"],
        ["d", "e", "f"],
        ["g", "h", "i"],
      ]);

      const actual = Array.from(grid);
      t.assert.deepEqual(actual, [
        ["a", 0, 0],
        ["b", 1, 0],
        ["c", 2, 0],
        ["d", 0, 1],
        ["e", 1, 1],
        ["f", 2, 1],
        ["g", 0, 2],
        ["h", 1, 2],
        ["i", 2, 2],
      ]);
    });
  });

  describe("values", () => {
    it("returns an iterator over the grid's values", (t) => {
      const grid = Grid2D.from2DArray([
        ["a", "b", "c"],
        ["d", "e", "f"],
        ["g", "h", "i"],
      ]);

      const actual = Array.from(grid.values());
      t.assert.deepEqual(actual, ["a", "b", "c", "d", "e", "f", "g", "h", "i"]);
    });
  });
});
