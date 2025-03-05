import { Array2D } from "../../lib/collections/array2d";
import { range, sum } from "../../lib/iter";
import { createSolverWithString } from "../../solution";

// Inspired by https://lakret.net/blog/2023-12-15-aoc-days-13-14
//
// The idea here is that we we turn every row and every column into a binary
// number where `#` is 1 and `.` is 0. This way we can easily compare rows and
// columns for symmetry, and especially makes part 2 easier when we can just
// flip a bit in the pattern to find the symmetry.

type Pattern = {
  // The numbers representing each row
  rows: Array<number>;
  // The numbers representing each column
  columns: Array<number>;
};
type Symmetry = [number, null] | [null, number] | [null, null];

/**
 * Converts a series of `#`s and `.`s into a number.
 */
function patternLineToNumber(line: Array<string>): number {
  const bits = line.join("").replaceAll("#", "1").replaceAll(".", "0");
  return Number.parseInt(bits, 2);
}

/**
 * Parses the input into an array of `Pattern`.
 */
function parse(input: string): Array<Pattern> {
  const rawPatterns = input.split("\n\n");
  const patterns: Array<Pattern> = [];

  for (const rawPattern of rawPatterns) {
    const grid = new Array2D(
      rawPattern.split("\n").map((line) => line.split(""))
    );

    const rows = Array.from(grid.rows().map(patternLineToNumber));
    const columns = Array.from(grid.columns().map(patternLineToNumber));

    patterns.push({ rows, columns });
  }

  return patterns;
}

/**
 * Returns the index where a reflection is found, or `null` if none is found.
 *
 * If the index is equal to the `previous` index, it is ignored.
 */
function findReflection(ns: Array<number>, previous?: number | null) {
  for (const i of range(ns.length - 1)) {
    const mirrorHalfSize = Math.min(i + 1, ns.length - i - 1);

    let reflected = true;
    for (const offset of range(mirrorHalfSize)) {
      if (ns[i - offset] !== ns[i + offset + 1]) {
        reflected = false;
        break;
      }
    }

    if (reflected && i + 1 !== previous) {
      return i + 1;
    }
  }

  return null;
}

/**
 * Returns the symmetry of the pattern.
 *
 * Symmetry is a pair where:
 * - If the pattern has row symmetry the first element is the index and the
 *   second is `null`.
 * - If the pattern has column symmetry the second element is the index and the
 *   first is `null`.
 * - If the pattern has no symmetry, both elements are `null`.
 */
function findSymmetry(
  pattern: Pattern,
  previousSymmetry: Symmetry = [null, null]
): Symmetry {
  const rowIndex = findReflection(pattern.rows, previousSymmetry[0]);
  if (rowIndex !== null) {
    return [rowIndex, null];
  }

  const columnIndex = findReflection(pattern.columns, previousSymmetry[1]);
  if (columnIndex !== null) {
    return [null, columnIndex];
  }

  return [null, null];
}

/**
 * Find the symmetry of the pattern where a bit has been flipped.
 */
function findUnsmudgedSymmetry(pattern: Pattern): Symmetry {
  const previousSymmetry = findSymmetry(pattern);

  for (const row of range(pattern.rows.length)) {
    for (const column of range(pattern.columns.length)) {
      // To flip a bit we have to both flip it in the row and the column number

      // So lets flip it in the row
      const rowBit = pattern.columns.length - column - 1;
      const newRowNumber = pattern.rows[row] ^ (1 << rowBit);
      const newRows = pattern.rows.with(row, newRowNumber);

      // And in the column
      const colBit = pattern.rows.length - row - 1;
      const newColNumber = pattern.columns[column] ^ (1 << colBit);
      const newColumns = pattern.columns.with(column, newColNumber);

      // Create a new pattern with the flipped bit
      const newPattern = { rows: newRows, columns: newColumns };

      // And lets find the symmetry of the new pattern.
      // If symmetry is found, we return it, otherwise we continue.
      const symmetry = findSymmetry(newPattern, previousSymmetry);
      if (symmetry[0] !== null || symmetry[1] !== null) {
        return symmetry;
      }
    }
  }

  return [null, null];
}

/**
 * Summarizes the symmetry, i.e. return the sum of the column reflection index
 * and the row reflection index times 100.
 */
function summarize(symmetry: Symmetry) {
  const [row, column] = symmetry;
  if (column !== null) {
    return column;
  }
  if (row !== null) {
    return 100 * row;
  }

  throw new Error("Invalid symmetry");
}

export default createSolverWithString(async (input) => {
  const patterns = parse(input);

  return {
    first: sum(patterns.map((p) => findSymmetry(p)).map(summarize)),
    second: sum(patterns.map(findUnsmudgedSymmetry).map(summarize)),
  };
});
