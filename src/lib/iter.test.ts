import test, { describe } from "node:test";
import {
  all,
  combinations,
  isMonotonic,
  isStrictlyDecreasing,
  isStrictlyIncreasing,
  permute,
  range,
  slidingWindow,
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
});
