import { describe, it, TestContext } from "node:test";
import { Array2D } from "./array2d";

function assertEquals(
  t: TestContext,
  actual: Array2D<unknown>,
  expected: Array2D<unknown>
) {
  t.assert.equal(
    actual.equals(expected),
    true,
    `\nexpected\n\n${actual.toString()}\n\nto equal\n\n${expected.toString()}\n`
  );
}

describe("lib/collections/array2d", () => {
  describe("constructor", () => {
    it("should create a new Array2D by size", (t) => {
      const grid = new Array2D(3);

      t.assert.equal(grid.width, 3);
      t.assert.equal(grid.height, 3);
    });

    it("should create a new Array2D by row/col count", (t) => {
      const grid = new Array2D(3, 4);

      t.assert.equal(grid.width, 3);
      t.assert.equal(grid.height, 4);
    });

    it("should create a new array2d from 2d array", (t) => {
      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [10, 11, 12],
      ]);

      t.assert.equal(grid.width, 3);
      t.assert.equal(grid.height, 4);
    });

    it("should create a new array2d from flat array", (t) => {
      const grid = new Array2D(4, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

      t.assert.equal(grid.width, 4);
      t.assert.equal(grid.height, 3);
      t.assert.equal(grid.get(0, 0), 1);
      t.assert.equal(grid.get(1, 1), 6);
    });
  });

  describe("get", () => {
    it("should return the value at the given coordinates", (t) => {
      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);
      t.assert.equal(grid.get(0, 0), 1);
      t.assert.equal(grid.get(1, 1), 5);
    });

    it("should throw if coordinates are out of bound", (t) => {
      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);

      t.assert.throws(() => grid.get(3, 3));
      t.assert.throws(() => grid.get(-1, 0));
    });
  });

  describe("set", () => {
    it("should set the value at the given coordinates", (t) => {
      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);
      grid.set(0, 0, 10);
      t.assert.equal(grid.get(0, 0), 10);
    });

    it("should throw if coordinates are out of bound", (t) => {
      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);

      t.assert.throws(() => grid.set(3, 3, 10));
      t.assert.throws(() => grid.set(-1, 0, 10));
    });
  });

  describe("isInBounds", () => {
    it("should return true if the coordinates are in bounds", (t) => {
      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);

      t.assert.equal(grid.isInBounds(0, 0), true);
      t.assert.equal(grid.isInBounds(2, 2), true);
    });

    it("should return false if the coordinates are out of bounds", (t) => {
      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);

      t.assert.equal(grid.isInBounds(3, 3), false);
      t.assert.equal(grid.isInBounds(-1, 0), false);
    });
  });

  describe("height", () => {
    it("should return the height (number of rows)", (t) => {
      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [10, 11, 12],
      ]);

      t.assert.equal(grid.height, 4);
    });
  });

  describe("width", () => {
    it("should return the width (number of columns)", (t) => {
      const grid = new Array2D([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
      ]);

      t.assert.equal(grid.width, 4);
    });
  });

  describe("row", () => {
    it("should return an iterator over the given row", (t) => {
      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);

      const row = Array.from(grid.row(1));
      t.assert.deepEqual(row, [4, 5, 6]);
    });

    it("should return an iterator over the given row (negative index)", (t) => {
      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);

      const row = Array.from(grid.row(-1));
      t.assert.deepEqual(row, [7, 8, 9]);
    });
  });

  describe("rows", () => {
    it("should return an iterator over all rows", (t) => {
      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);

      const rows = Array.from(grid.rows());

      t.assert.deepEqual(rows, [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);
    });
  });

  describe("column", () => {
    it("should return an iterator over the given column", (t) => {
      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);

      const column = Array.from(grid.column(1));
      t.assert.deepEqual(column, [2, 5, 8]);
    });

    it("should return an iterator over the given column (negative index)", (t) => {
      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);

      const column = Array.from(grid.column(-1));
      t.assert.deepEqual(column, [3, 6, 9]);
    });
  });

  describe("columns", () => {
    it("should return an iterator over all columns", (t) => {
      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);

      const rows = Array.from(grid.columns());

      t.assert.deepEqual(rows, [
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
      ]);
    });
  });

  describe("sum", () => {
    it("should return the sum of all elements in numeric array2ds", (t) => {
      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);

      t.assert.equal(grid.sum(), 45);
    });

    it("should return the sum of all elements in array2ds when a function is provided", (t) => {
      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);

      t.assert.equal(
        grid.sum((x) => x * 2),
        90
      );
    });
  });

  describe("count", () => {
    it("should just return the size without a predicate", (t) => {
      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);

      t.assert.equal(grid.count(), 9);
    });

    it("should return count of elements that match the predicate", (t) => {
      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);

      t.assert.equal(
        grid.count((x) => x % 2 === 0),
        4
      );
    });
  });

  describe("transpose", () => {
    it("should return a new transposed array2d", (t) => {
      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);

      const expected = new Array2D([
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
      ]);

      t.assert.equal(grid.transpose().equals(expected), true);
    });

    it("should throw if the array2d is not square", (t) => {
      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
      ]);

      t.assert.throws(() => grid.transpose());
    });
  });

  describe("flipVertical", () => {
    it("should flip the array2d vertically", (t) => {
      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);

      const expected = new Array2D([
        [7, 8, 9],
        [4, 5, 6],
        [1, 2, 3],
      ]);

      t.assert.equal(grid.flipVertical().equals(expected), true);
    });
  });

  describe("flipHorizontal", () => {
    it("should flip the array2d horizontally", (t) => {
      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);

      const expected = new Array2D([
        [3, 2, 1],
        [6, 5, 4],
        [9, 8, 7],
      ]);

      t.assert.equal(grid.flipHorizontal().equals(expected), true);
    });
  });

  describe("rotateCW", () => {
    it("should rotate the array2d 90 degrees clockwise", (t) => {
      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);

      const expected = new Array2D([
        [7, 4, 1],
        [8, 5, 2],
        [9, 6, 3],
      ]);

      assertEquals(t, grid.rotateCW(), expected);
    });

    it("should rotate the array2d 270 degrees clockwise", (t) => {
      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);

      const expected = new Array2D([
        [3, 6, 9],
        [2, 5, 8],
        [1, 4, 7],
      ]);

      assertEquals(t, grid.rotateCW(3), expected);
    });
  });

  describe("rotateCCW", (t) => {
    it("should rotate the array2d 90 degrees counter-clockwise", (t) => {
      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);

      const expected = new Array2D([
        [3, 6, 9],
        [2, 5, 8],
        [1, 4, 7],
      ]);

      assertEquals(t, grid.rotateCCW(), expected);
    });

    it("should rotate the array2d 270 degrees counter-clockwise", (t) => {
      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);

      const expected = new Array2D([
        [7, 4, 1],
        [8, 5, 2],
        [9, 6, 3],
      ]);

      assertEquals(t, grid.rotateCCW(3), expected);
    });
  });

  describe("crop", () => {
    it("should return a new array2d cropped to the given bounds", (t) => {
      const grid = new Array2D([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16],
      ]);

      const expected = new Array2D([
        [6, 7],
        [10, 11],
      ]);

      assertEquals(t, grid.crop(1, 1, 2, 2), expected);
    });

    it("should return a new array2d cropped to the given bounds (alternative input)", (t) => {
      const grid = new Array2D([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16],
      ]);

      const expected = new Array2D([[1], [5], [9], [13]]);

      assertEquals(t, grid.crop(0, 0, 1, 4), expected);
    });

    it("should throw if the bounds are out of the array2d", (t) => {
      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);

      t.assert.throws(() => grid.crop(1, 1, 3, 3));
      t.assert.throws(() => grid.crop(-1, -1, 1, 1));
    });
  });

  describe("trim", () => {
    it("should remove a 1 wide border", (t) => {
      const grid = new Array2D([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16],
      ]);
      const expected = new Array2D([
        [6, 7],
        [10, 11],
      ]);
      assertEquals(t, grid.trim(), expected);
    });

    it("should remove specific horizontal/vertical width border", (t) => {
      const grid = new Array2D([
        [1, 2, 3, 4, 5],
        [6, 7, 8, 9, 10],
        [11, 12, 13, 14, 15],
        [16, 17, 18, 19, 20],
        [21, 22, 23, 24, 25],
      ]);
      const expected = new Array2D([[12, 13, 14]]);
      assertEquals(t, grid.trim(1, 2), expected);
    });

    it("should remove any arbitrary width border", (t) => {
      const grid = new Array2D([
        [1, 2, 3, 4, 5, 6],
        [7, 8, 9, 10, 11, 12],
        [13, 14, 15, 16, 17, 18],
        [19, 20, 21, 22, 23, 24],
        [25, 26, 27, 28, 29, 30],
        [31, 32, 33, 34, 35, 36],
      ]);

      const expected = new Array2D([
        [4, 5],
        [10, 11],
        [16, 17],
        [22, 23],
      ]);

      assertEquals(t, grid.trim(3, 0, 1, 2), expected);
    });
  });

  describe("clone", (t) => {
    it("should return a new array2d with the same values", (t) => {
      const original = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);

      const clone = original.clone();

      assertEquals(t, clone, original);
      original.set(0, 0, 10);
      t.assert.equal(clone.get(0, 0), 1);
    });
  });

  describe("paste", () => {
    it("will paste a smaller array2d into a larger one", (t) => {
      const grid = new Array2D([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16],
      ]);

      const toPaste = new Array2D([
        [90, 91],
        [92, 93],
      ]);

      const expected = new Array2D([
        [1, 2, 3, 4],
        [5, 90, 91, 8],
        [9, 92, 93, 12],
        [13, 14, 15, 16],
      ]);

      assertEquals(t, grid.paste(1, 1, toPaste), expected);
    });

    it("will throw if the pasted array will be out of bounds", (t) => {
      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);

      t.assert.throws(() => {
        grid.paste(
          2,
          2,
          new Array2D([
            [0, 0, 0],
            [0, 0, 0],
          ])
        );
      });
    });
  });

  describe("values", () => {
    it("should iterate over all values", (t) => {
      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);

      const values = Array.from(grid.values());

      t.assert.deepEqual(values, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
  });

  describe("entries", () => {
    it("should iterate over all values with coordinates", (t) => {
      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);

      const expected = [
        [1, 0, 0],
        [2, 1, 0],
        [3, 2, 0],
        [4, 0, 1],
        [5, 1, 1],
        [6, 2, 1],
        [7, 0, 2],
        [8, 1, 2],
        [9, 2, 2],
      ];

      const actual = Array.from(grid.entries());

      t.assert.deepEqual(actual, expected);
    });
  });

  describe("find", () => {
    it("should return the matching value", (t) => {
      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);

      t.assert.equal(
        grid.find((x) => x === 5),
        5
      );
    });

    it("should return undefined it no value is found", (t) => {
      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);

      t.assert.equal(
        grid.find((x) => x === 10),
        undefined
      );
    });
  });

  describe("findCoordinates", () => {
    it("should return the coordinates of the matching value", (t) => {
      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);

      t.assert.deepEqual(
        grid.findCoordinates((x) => x === 6),
        [2, 1]
      );
    });

    it("should return undefined if no value is found", (t) => {
      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);

      t.assert.equal(
        grid.findCoordinates((x) => x === 10),
        undefined
      );
    });
  });

  describe("findAllCoordinates", () => {
    it("should yield the coordinates of all matching values", (t) => {
      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);

      const expected = [
        [1, 0],
        [0, 1],
        [2, 1],
        [1, 2],
      ];

      t.assert.deepEqual(
        Array.from(grid.findAllCoordinates((x) => x % 2 === 0)),
        expected
      );
    });

    it("should yield nothing if no value is found", (t) => {
      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);

      t.assert.deepEqual(
        Array.from(grid.findAllCoordinates((x) => x > 100)),
        []
      );
    });
  });

  describe("forEach", () => {
    it("should iterate over all values with coordinates", (t) => {
      let sum = 0;
      let xsum = 0;
      let ysum = 0;

      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
      ]);

      grid.forEach((value, x, y) => {
        sum += value;
        xsum += x;
        ysum += y;
      });

      t.assert.equal(sum, 21);
      t.assert.equal(xsum, 6);
      t.assert.equal(ysum, 3);
    });
  });

  describe("map", () => {
    it("should return a new array2d with the values mapped", (t) => {
      const grid = new Array2D([
        [0, 1, 2],
        [3, 4, 5],
      ]);

      const expected = new Array2D([
        ["1-0,0", "2-1,0", "4-2,0"],
        ["8-0,1", "16-1,1", "32-2,1"],
      ]);

      const actual = grid.map((value, x, y) => {
        return `${2 ** value}-${x},${y}`;
      });

      assertEquals(t, actual, expected);
    });
  });

  describe("reduce", () => {
    it("should reduce the array2d to a single value", (t) => {
      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
      ]);

      const actual = grid.reduce((acc, value) => acc + value, 0);
      t.assert.equal(actual, 21);
    });
  });

  describe("min", () => {
    it("should return the minimum value in the array2d with coordinates", (t) => {
      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 6],
        [-42, 8, 9],
      ]);

      const [min, x, y] = grid.min();
      t.assert.equal(min, -42);
      t.assert.equal(x, 0);
      t.assert.equal(y, 2);
    });

    it("should return the minimum value in the array2d with coordinates given a by function", (t) => {
      const grid = new Array2D([
        [
          { k: 1, v: 1 },
          { k: 2, v: 2 },
          { k: 3, v: 3 },
        ],
        [
          { k: 4, v: 4 },
          { k: 5, v: 5 },
          { k: 6, v: 6 },
        ],
        [
          { k: 7, v: -42 },
          { k: 8, v: 8 },
          { k: 9, v: 9 },
        ],
      ]);

      const [min, x, y] = grid.min((o) => o.v);
      t.assert.deepEqual(min, { k: 7, v: -42 });
      t.assert.equal(x, 0);
      t.assert.equal(y, 2);
    });
  });

  describe("max", () => {
    it("should return the maximum value in the array2d with coordinates", (t) => {
      const grid = new Array2D([
        [1, 2, 3],
        [4, 5, 69],
        [7, 8, 9],
      ]);

      const [max, x, y] = grid.max();
      t.assert.equal(max, 69);
      t.assert.equal(x, 2);
      t.assert.equal(y, 1);
    });

    it("should return the maximum value in the array2d with coordinates given a by function", (t) => {
      const grid = new Array2D([
        [
          { k: 1, v: 1 },
          { k: 2, v: 2 },
          { k: 3, v: 3 },
        ],
        [
          { k: 4, v: 4 },
          { k: 5, v: 5 },
          { k: 6, v: 69 },
        ],
        [
          { k: 7, v: 7 },
          { k: 8, v: 8 },
          { k: 9, v: 9 },
        ],
      ]);

      const [max, x, y] = grid.max((o) => o.v);
      t.assert.deepEqual(max, { k: 6, v: 69 });
      t.assert.equal(x, 2);
      t.assert.equal(y, 1);
    });
  });

  describe("neighbors", () => {
    it("should yield all cardinal neighbors", (t) => {
      const grid = new Array2D([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
      ]);

      const actual = Array.from(grid.neighbors(2, 1));
      const expected = [
        [3, 2, 0],
        [8, 3, 1],
        [11, 2, 2],
        [6, 1, 1],
      ];

      t.assert.deepEqual(actual, expected);
    });

    it("should skip out of bounds neighbors", (t) => {
      const grid = new Array2D([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
      ]);

      const actual = Array.from(grid.neighbors(3, 2));
      const expected = [
        [8, 3, 1],
        [11, 2, 2],
      ];

      t.assert.deepEqual(actual, expected);
    });
  });

  describe("diagonalNeighbors", () => {
    it("should yield all diagonal neighbors", (t) => {
      const grid = new Array2D([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
      ]);

      const actual = Array.from(grid.diagonalNeighbors(2, 1));
      const expected = [
        [2, 1, 0],
        [4, 3, 0],
        [12, 3, 2],
        [10, 1, 2],
      ];

      t.assert.deepEqual(actual, expected);
    });

    it("should skip out of bounds neighbors", (t) => {
      const grid = new Array2D([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
      ]);

      const actual = Array.from(grid.diagonalNeighbors(3, 2));
      const expected = [[7, 2, 1]];

      t.assert.deepEqual(actual, expected);
    });
  });

  describe("mooreNeighbors", () => {
    it("should yield all moore neighbors", (t) => {
      const grid = new Array2D([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
      ]);

      const actual = Array.from(grid.mooreNeighbors(2, 1));
      const expected = [
        [3, 2, 0],
        [4, 3, 0],
        [8, 3, 1],
        [12, 3, 2],
        [11, 2, 2],
        [10, 1, 2],
        [6, 1, 1],
        [2, 1, 0],
      ];

      t.assert.deepEqual(actual, expected);
    });

    it("should skip out of bounds neighbors", (t) => {
      const grid = new Array2D([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
      ]);

      const actual = Array.from(grid.mooreNeighbors(3, 2));
      const expected = [
        [8, 3, 1],
        [11, 2, 2],
        [7, 2, 1],
      ];

      t.assert.deepEqual(actual, expected);
    });
  });
});
