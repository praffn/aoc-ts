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

  describe("from2DArray", () => {
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

  describe("fromLines", () => {
    it("should construct a valid grid", (t) => {
      const grid = Grid2D.fromLines(["abc", "def", "ghi"]);

      t.assert.equal(grid.width, 3);
      t.assert.equal(grid.height, 3);
      t.assert.equal(grid.at(0, 0), "a");
      t.assert.equal(grid.at(1, 1), "e");
      t.assert.equal(grid.at(2, 2), "i");
    });

    it("should allow custom line parsing", (t) => {
      const grid = Grid2D.fromLines(["1,2,3", "4,5,6", "7,8,9"], (line) =>
        line.split(",").map((n) => Number.parseInt(n))
      );

      t.assert.equal(grid.width, 3);
      t.assert.equal(grid.height, 3);
      t.assert.equal(grid.at(0, 0), 1);
      t.assert.equal(grid.at(1, 1), 5);
      t.assert.equal(grid.at(2, 2), 9);
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

  describe("findPosition", () => {
    it("should return the position of the first matching value", (t) => {
      const grid = Grid2D.from2DArray([
        ["a", "b", "c"],
        ["d", "e", "f"],
        ["g", "h", "i"],
      ]);

      const actual = grid.findPosition((v) => v === "e");
      t.assert.deepEqual(actual, [1, 1]);
    });

    it("should return undefined if no matching value is found", (t) => {
      const grid = Grid2D.from2DArray([
        ["a", "b", "c"],
        ["d", "e", "f"],
        ["g", "h", "i"],
      ]);

      const actual = grid.findPosition((v) => v === "z");
      t.assert.equal(actual, undefined);
    });
  });

  describe("findAllPositions", () => {
    it("should return the positions of all matching values", (t) => {
      const grid = Grid2D.from2DArray([
        ["a", "x", "x"],
        ["x", "a", "x"],
        ["a", "x", "a"],
      ]);

      const actual = Array.from(
        grid.findAllPositions((v) => v === "a")
      ).toSorted();
      t.assert.deepEqual(actual, [
        [0, 0],
        [0, 2],
        [1, 1],
        [2, 2],
      ]);
    });

    it("should return an empty iterator if no matching value is found", (t) => {
      const grid = Grid2D.from2DArray([
        ["a", "b", "c"],
        ["d", "e", "f"],
        ["g", "h", "i"],
      ]);

      const actual = Array.from(grid.findAllPositions((v) => v === "z"));
      t.assert.deepEqual(actual, []);
    });
  });

  describe("neighbors", () => {
    const grid = Grid2D.from2DArray([
      ["a", "b", "c"],
      ["d", "e", "f"],
      ["g", "h", "i"],
    ]);

    it("should return 4 neighbors for non-edge cell", (t) => {
      const actual = Array.from(grid.neighbors(1, 1))
        .map(({ value, x, y }) => [value, x, y])
        .toSorted();
      t.assert.deepEqual(actual, [
        ["b", 1, 0],
        ["d", 0, 1],
        ["f", 2, 1],
        ["h", 1, 2],
      ]);
    });

    it("should return 3 neighbors for edge cell", (t) => {
      const actual = Array.from(grid.neighbors(1, 0))
        .map(({ value, x, y }) => [value, x, y])
        .toSorted();
      t.assert.deepEqual(actual, [
        ["a", 0, 0],
        ["c", 2, 0],
        ["e", 1, 1],
      ]);
    });

    it("should return 2 neighbors for corner cell", (t) => {
      const actual = Array.from(grid.neighbors(0, 0))
        .map(({ value, x, y }) => [value, x, y])
        .toSorted();
      t.assert.deepEqual(actual, [
        ["b", 1, 0],
        ["d", 0, 1],
      ]);
    });

    it("should return neighbors that satisfy the predicate", (t) => {
      const actual = Array.from(
        grid.neighbors(1, 1, (v) => v !== "f" && v !== "h")
      )
        .map(({ value, x, y }) => [value, x, y])
        .toSorted();
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
      const actual = Array.from(grid.neighborsWithDiagonals(1, 1))
        .map(({ value, x, y }) => [value, x, y])
        .toSorted();
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
      const actual = Array.from(grid.neighborsWithDiagonals(1, 0))
        .map(({ value, x, y }) => [value, x, y])
        .toSorted();
      t.assert.deepEqual(actual, [
        ["a", 0, 0],
        ["c", 2, 0],
        ["d", 0, 1],
        ["e", 1, 1],
        ["f", 2, 1],
      ]);
    });

    it("should return 3 neighbors corner cell", (t) => {
      const actual = Array.from(grid.neighborsWithDiagonals(0, 0))
        .map(({ value, x, y }) => [value, x, y])
        .toSorted();
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

  describe("row", () => {
    it("should return a iterator for the given row", (t) => {
      const grid = Grid2D.from2DArray([
        ["a", "b", "c"],
        ["d", "e", "f"],
        ["g", "h", "i"],
      ]);

      const actual = Array.from(grid.row(1));
      t.assert.deepEqual(actual, ["d", "e", "f"]);
    });
  });

  describe("column", () => {
    it("should return a iterator for the given column", (t) => {
      const grid = Grid2D.from2DArray([
        ["a", "b", "c"],
        ["d", "e", "f"],
        ["g", "h", "i"],
      ]);

      const actual = Array.from(grid.column(1));
      t.assert.deepEqual(actual, ["b", "e", "h"]);
    });
  });

  describe("fillRect", () => {
    it("should fill a rectangle with the given value", (t) => {
      const grid = new Grid2D(3, 3, 0);
      grid.fillRect(0, 0, 2, 2, 1);

      const expected = [1, 1, 0, 1, 1, 0, 0, 0, 0];
      const actual = Array.from(grid.values());
      t.assert.deepEqual(actual, expected);
    });

    it("should only draw in the bounds of the grid", (t) => {
      const grid = new Grid2D(3, 3, 0);
      grid.fillRect(-1, -1, 3, 3, 1);

      const expected = [1, 1, 0, 1, 1, 0, 0, 0, 0];
      const actual = Array.from(grid.values());
      t.assert.deepEqual(actual, expected);
    });
  });

  describe("count", () => {
    it("should count the number of values that match the predicate", (t) => {
      const grid = Grid2D.from2DArray([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);

      const actual = grid.count((v) => v % 2 === 0);
      t.assert.equal(actual, 4);
    });
  });

  describe("dfs", () => {
    const grid = Grid2D.from2DArray([
      [1, 1, 2],
      [3, 1, 4],
      [5, 1, 1],
    ]);

    it("should return an DFS iterator over the grid at the position", (t) => {
      const expected = [
        [1, 0, 0],
        [1, 1, 0],
        [1, 1, 1],
        [1, 1, 2],
        [1, 2, 2],
      ];
      const actual = Array.from(grid.dfs(1, 0)).toSorted();
      t.assert.deepEqual(actual, expected);
    });

    it("should return an DFS iterator over the grid at the position with a custom predicate", (t) => {
      const expected = [
        [1, 0, 0],
        [1, 1, 0],
        [3, 0, 1],
        [1, 1, 1],
        [5, 0, 2],
        [1, 1, 2],
        [1, 2, 2],
      ];
      const actual = Array.from(
        grid.dfs(1, 0, {
          predicate: (v) => v % 2 === 1,
        })
      ).toSorted((a, b) => {
        if (a[2] < b[2]) return -1;
        if (a[2] > b[2]) return 1;
        if (a[1] < b[1]) return -1;
        if (a[1] > b[1]) return 1;
        return 0;
      });
      t.assert.deepEqual(actual, expected);
    });

    it("should return an DFS iterator over the grid at the position with a custom neighbor function", (t) => {
      const expected = [
        [1, 1, 0],
        [1, 1, 1],
        [1, 1, 2],
      ];
      const actual = Array.from(
        grid.dfs(1, 0, {
          getNeighbors(x, y) {
            return [{ x, y: y + 1 }];
          },
        })
      ).toSorted((a, b) => {
        if (a[2] < b[2]) return -1;
        if (a[2] > b[2]) return 1;
        if (a[1] < b[1]) return -1;
        if (a[1] > b[1]) return 1;
        return 0;
      });
      t.assert.deepEqual(actual, expected);
    });
  });

  describe("regions", () => {
    it("should return an iterator over the regions of the grid", (t) => {
      const grid = Grid2D.from2DArray([
        ["a", "a", "a"],
        ["b", "b", "a"],
        ["a", "c", "c"],
      ]);

      const regions = Array.from(grid.regions()).toSorted();
      const exptected = [
        [
          [0, 0, 1],
          [1, 0, 2],
          [2, 0, 2],
          [2, 1, 1],
        ],
        [
          [0, 1, 1],
          [1, 1, 1],
        ],
        [[0, 2, 0]],
        [
          [1, 2, 1],
          [2, 2, 1],
        ],
      ];

      t.assert.deepEqual(regions, exptected);
    });
  });

  describe("toString", () => {
    it("should return a string representation of the grid", (t) => {
      const grid = Grid2D.from2DArray([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);

      const actual = grid.toString();
      const expected = "123\n456\n789";
      t.assert.equal(actual, expected);
    });
  });
});
