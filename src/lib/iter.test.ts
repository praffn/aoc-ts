import test, { describe, it } from "node:test";
import {
  all,
  cartesianRange,
  chain,
  combinations,
  counter,
  divisors,
  enumerate,
  isMonotonic,
  isStrictlyDecreasing,
  isStrictlyIncreasing,
  max,
  min,
  numericProduct,
  permutations,
  permute,
  product,
  range,
  slidingWindow,
  sum,
  zip,
  count,
  powerSet,
  chunk,
  chunkWhile,
  minBy,
} from "./iter";

describe("lib > iter", () => {
  describe("slidingWindow", () => {
    test("size < 2 should throw", (t) => {
      t.assert.throws(() => {
        slidingWindow([1, 2, 3], 1).next();
      });
    });

    test("size = 2", (t) => {
      const input = [1, 2, 3, 4, 5];
      const expected = [
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5],
      ];
      const actual = Array.from(slidingWindow(input, 2));
      t.assert.deepEqual(actual, expected);
    });

    test("length < size", (t) => {
      const input = [1, 2, 3, 4, 5];
      const expected: Array<number> = [];
      const actual = Array.from(slidingWindow(input, 10));
      t.assert.deepEqual(actual, expected);
    });

    test("size = length", (t) => {
      const input = [1, 2, 3];
      const expected = [[1, 2, 3]];
      const actual = Array.from(slidingWindow(input, 3));
      t.assert.deepEqual(actual, expected);
    });
  });

  describe("all", () => {
    test("empty", (t) => {
      const actual = all([], (n) => n > 0);
      t.assert.equal(actual, true);
    });

    test("all true", (t) => {
      const actual = all([1, 2, 3], (n) => n > 0);
      t.assert.equal(actual, true);
    });

    test("some false", (t) => {
      const actual = all([1, 2, 3], (n) => n > 1);
      t.assert.equal(actual, false);
    });

    test("all false", (t) => {
      const actual = all([1, 2, 3], (n) => n > 3);
      t.assert.equal(actual, false);
    });
  });

  describe("permute", () => {
    test("empty", (t) => {
      const actual = Array.from(permute([]));
      t.assert.deepEqual(actual, [[]]);
    });

    test("with unique values", (t) => {
      const input = [1, 2, 3];
      const expected = [
        [1, 2, 3],
        [1, 3, 2],
        [3, 2, 1],
        [3, 1, 2],
        [2, 1, 3],
        [2, 3, 1],
      ].toSorted();

      const actual = Array.from(permute(input));
      const actualSorted = actual.toSorted();

      t.assert.deepEqual(actualSorted, expected);
    });

    test("with non values", (t) => {
      const input = [1, 1, 3];
      const expected = [
        [1, 1, 3],
        [1, 3, 1],
        [3, 1, 1],
        [3, 1, 1],
        [1, 1, 3],
        [1, 3, 1],
      ].toSorted();

      const actual = Array.from(permute(input));
      const actualSorted = actual.toSorted();

      t.assert.deepEqual(actualSorted, expected);
    });
  });

  describe("count", () => {
    it("should count the size of the iterable", (t) => {
      const actual = count([1, 2, 3, 4, 5]);
      t.assert.equal(actual, 5);
    });

    it("should return 0 for an empty iterable", (t) => {
      const actual = count([]);
      t.assert.equal(actual, 0);
    });

    it("should count the number of values passing a predicate", (t) => {
      const actual = count([1, 2, 3, 4, 5], (n) => n % 2 === 0);
      t.assert.equal(actual, 2);
    });
  });

  describe("counter", () => {
    it("should count the number of occurrences of each element", (t) => {
      const actual = counter([1, 2, 3, 1, 2, 1]);
      t.assert.deepEqual(
        actual,
        new Map([
          [1, 3],
          [2, 2],
          [3, 1],
        ])
      );
    });
  });

  describe("range", () => {
    test("only end", (t) => {
      const actual = Array.from(range(5));
      t.assert.deepEqual(actual, [0, 1, 2, 3, 4]);
    });

    test("with start", (t) => {
      const actual = Array.from(range(3, 9));
      t.assert.deepEqual(actual, [3, 4, 5, 6, 7, 8]);
    });

    test("with skip", (t) => {
      const actual = Array.from(range(3, 9, 2));
      t.assert.deepEqual(actual, [3, 5, 7]);
    });

    test("with negative skip", (t) => {
      const actual = Array.from(range(9, 3, -2));
      t.assert.deepEqual(actual, [9, 7, 5]);
    });

    test("throws when step is zero", (t) => {
      t.assert.throws(() => {
        Array.from(range(0, 10, 0));
      });
    });
  });

  describe("cartesianRange", () => {
    it("should yield all values in the range", (t) => {
      const actual = Array.from(cartesianRange(-2, 2, -1, 1));
      const expected = [
        [-2, -1],
        [-2, 0],
        [-1, -1],
        [-1, 0],
        [0, -1],
        [0, 0],
        [1, -1],
        [1, 0],
      ];

      t.assert.deepEqual(actual, expected);
    });
  });

  describe("permutations", () => {
    test("empty", (t) => {
      const actual = Array.from(permutations([]));
      t.assert.deepEqual(actual, [[]]);
    });

    test("returns permutations", (t) => {
      const actual = Array.from(permutations([1, 2, 3])).toSorted();
      const expected = [
        [1, 2, 3],
        [1, 3, 2],
        [2, 1, 3],
        [2, 3, 1],
        [3, 1, 2],
        [3, 2, 1],
      ];

      t.assert.deepEqual(actual, expected);
    });

    test("returns n permutations", (t) => {
      const actual = Array.from(permutations([1, 2, 3], 2)).toSorted();
      const expected = [
        [1, 2],
        [1, 3],
        [2, 1],
        [2, 3],
        [3, 1],
        [3, 2],
      ];

      t.assert.deepEqual(actual, expected);
    });
  });

  describe("combinations", () => {
    test("3 choose 1", (t) => {
      const actual = Array.from(combinations([1, 2, 3], 1)).toSorted();
      t.assert.deepEqual(actual, [[1], [2], [3]]);
    });

    test("3 choose 2", (t) => {
      const actual = Array.from(combinations([1, 2, 3], 2)).toSorted();
      t.assert.deepEqual(actual, [
        [1, 2],
        [1, 3],
        [2, 3],
      ]);
    });

    test("3 choose 3", (t) => {
      const actual = Array.from(combinations([1, 2, 3], 3)).toSorted();
      t.assert.deepEqual(actual, [[1, 2, 3]]);
    });
  });

  describe("product", () => {
    test("empty", (t) => {
      const expected: Array<unknown> = [];
      const actual = Array.from(product([]));
      t.assert.deepEqual(actual, expected);
    });

    test("with even length", (t) => {
      const expected = [
        [1, 3],
        [1, 4],
        [2, 3],
        [2, 4],
      ];
      const actual = Array.from(product([1, 2], [3, 4])).toSorted();
      t.assert.deepEqual(actual, expected);
    });

    test("with uneven length", (t) => {
      const expected = [
        [1, 4],
        [1, 5],
        [2, 4],
        [2, 5],
        [3, 4],
        [3, 5],
      ];
      const actual = Array.from(product([1, 2, 3], [4, 5])).toSorted();
      t.assert.deepEqual(actual, expected);
    });
  });

  describe("divisors", () => {
    test("divisors of 255", (t) => {
      const expected = [1, 3, 5, 15, 17, 51, 85, 255];
      const actual = Array.from(divisors(255)).toSorted((a, b) => a - b);
      t.assert.deepEqual(actual, expected);
    });

    test("divisors of prime", (t) => {
      const n = 233;
      const expected = [1, n];
      const actual = Array.from(divisors(n)).toSorted((a, b) => a - b);
      t.assert.deepEqual(actual, expected);
    });
  });

  describe("chain", () => {
    test("empty", (t) => {
      const actual = Array.from(chain());
      t.assert.deepEqual(actual, []);
    });

    test("single", (t) => {
      const actual = Array.from(chain([1, 2, 3]));
      t.assert.deepEqual(actual, [1, 2, 3]);
    });

    test("multiple", (t) => {
      const actual = Array.from(chain([1, 2, 3], [4, 5], [6]));
      t.assert.deepEqual(actual, [1, 2, 3, 4, 5, 6]);
    });
  });

  describe("min", () => {
    test("empty returns undefined", (t) => {
      const actual = min([]);
      t.assert.equal(actual, undefined);
    });

    test("empty with default value returns default value", (t) => {
      const actual = min([], 42);
      t.assert.equal(actual, 42);
    });

    test("returns the smallest number", (t) => {
      const actual = min([3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]);
      t.assert.equal(actual, 1);
    });
  });

  describe("minBy", () => {
    it("should return the item with the smallest selector value", (t) => {
      const items = ["foo3", "bar1", "baz4", "qux2"];
      const actual = minBy(items, (item) =>
        Number.parseInt(item.slice(-1), 10)
      );

      t.assert.equal(actual, "bar1");
    });

    it("should return the first item with the smallest selector value", (t) => {
      const items = ["foo3", "bar1", "baz1", "qux2"];
      const actual = minBy(items, (item) =>
        Number.parseInt(item.slice(-1), 10)
      );

      t.assert.equal(actual, "bar1");
    });

    it("should return undefined for an empty iterable", (t) => {
      t.assert.equal(
        minBy([], (n) => n),
        undefined
      );
    });
  });

  describe("max", () => {
    test("empty returns undefined", (t) => {
      const actual = max([]);
      t.assert.equal(actual, undefined);
    });

    test("empty with default value returns default value", (t) => {
      const actual = max([], 42);
      t.assert.equal(actual, 42);
    });

    test("returns the largest number", (t) => {
      const actual = max([3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]);
      t.assert.equal(actual, 9);
    });
  });

  describe("sum", () => {
    test("empty returns 0", (t) => {
      const actual = sum([]);
      t.assert.equal(actual, 0);
    });

    test("sums the numbers", (t) => {
      const actual = sum([1, 2, 3, 4, 5, -6]);
      t.assert.equal(actual, 9);
    });
  });

  describe("numericProduct", () => {
    test("empty returns 1", (t) => {
      const actual = numericProduct([]);
      t.assert.equal(actual, 1);
    });

    test("returns the product of the numbers", (t) => {
      const actual = numericProduct([1, 2, 3, 4, 5, -6]);
      t.assert.equal(actual, -720);
    });
  });

  describe("zip", () => {
    it("should zip two iterables", (t) => {
      const actual = Array.from(zip([1, 2, 3], ["a", "b", "c"]));
      t.assert.deepEqual(actual, [
        [1, "a"],
        [2, "b"],
        [3, "c"],
      ]);
    });

    it("should stop when the shortest iterable is exhausted", (t) => {
      const actual = Array.from(zip([1, 2], ["a", "b", "c"]));
      t.assert.deepEqual(actual, [
        [1, "a"],
        [2, "b"],
      ]);
    });
  });

  describe("enumerate", () => {
    it("should enumerate an iterable", (t) => {
      const actual = Array.from(enumerate(["a", "b", "c"]));
      t.assert.deepEqual(actual, [
        [0, "a"],
        [1, "b"],
        [2, "c"],
      ]);
    });
  });

  test("isStrictlyIncreasing", (t) => {
    const cases = [
      [[1, 2, 3, 4, 5], true],
      [[1, 2, 3, 3, 5], false],
      [[5, 4, 3, 2, 1], false],
      [[1], true],
      [[], true],
      [[1, 1, 1, 1, 1], false],
    ] as const;

    for (const [ns, expected] of cases) {
      const actual = isStrictlyIncreasing(ns);
      t.assert.equal(
        actual,
        expected,
        `isStrictlyIncreasing(${ns}) => ${expected}`
      );
    }
  });

  test("isStrictlyDecreasing", (t) => {
    const cases = [
      [[5, 4, 3, 2, 1], true],
      [[5, 4, 3, 3, 1], false],
      [[1, 2, 3, 4, 5], false],
      [[1], true],
      [[], true],
      [[5, 5, 5, 5, 5], false],
    ] as const;

    for (const [ns, expected] of cases) {
      const actual = isStrictlyDecreasing(ns);
      t.assert.equal(
        actual,
        expected,
        `isStrictlyDecreasing(${ns}) => ${expected}`
      );
    }
  });

  test("isMonotonic", (t) => {
    const cases = [
      [[1, 2, 3, 4, 5], true],
      [[5, 4, 3, 2, 1], true],
      [[1, 2, 3, 3, 5], false],
      [[5, 4, 3, 3, 1], false],
      [[1], true],
      [[], true],
      [[1, 1, 1, 1, 1], false],
      [[5, 5, 5, 5, 5], false],
    ] as const;

    for (const [ns, expected] of cases) {
      const actual = isMonotonic(ns);
      t.assert.equal(actual, expected, `isMonotonic(${ns}) => ${expected}`);
    }
  });

  describe("powerSet", () => {
    it("should return the power set of the given iterable", (t) => {
      const actual = Array.from(powerSet([1, 2, 3])).sort();
      const expected = [
        [],
        [1],
        [2],
        [1, 2],
        [3],
        [1, 3],
        [2, 3],
        [1, 2, 3],
      ].sort();

      t.assert.deepEqual(actual, expected);
    });
  });

  describe("chunk", () => {
    it("should chunk the iterable", (t) => {
      const actual = Array.from(chunk([1, 2, 3, 4, 5, 6, 7, 8], 3));
      const expected = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8],
      ];

      t.assert.deepEqual(actual, expected);
    });
  });

  describe("chunkWhile", () => {
    it("should chunk the iterable", (t) => {
      const actual = Array.from(
        chunkWhile(
          [1, 2, 3, "foo", 4, 5, 6, "bar", 7, "baz", "qux", 8],
          (n) => typeof n === "number"
        )
      );

      const expected = [[1, 2, 3], [4, 5, 6], [7], [8]];

      t.assert.deepEqual(actual, expected);
    });
  });
});
