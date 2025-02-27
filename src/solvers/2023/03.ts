import { StructuralMap } from "../../lib/collections/structural-map";
import { cartesianRange, sum } from "../../lib/iter";
import { key, makeVec2, type Vec2 } from "../../lib/linalg/vec2";
import { createSolverWithLineArray } from "../../solution";

function isSymbol(c: string): boolean {
  return c !== "." && !(c >= "0" && c <= "9");
}

type SymbolMap = StructuralMap<
  Vec2,
  { symbol: string; numbers: Array<number> }
>;

/**
 * Parses the input into a symbol map
 * A symbol map is a map from a position to some symbol ('*', '$' etc) and
 * a list of the numbers that are its neighbors. The symbols in the map are
 * guaranteed to have at least one number as a neighbor.
 */
function parse(input: Array<string>) {
  const symbolMap: SymbolMap = new StructuralMap(key);

  // lets loop through each line of the input
  for (const [y, line] of input.entries()) {
    // for each line we try to match on numbers
    for (const match of line.matchAll(/\d+/g)) {
      const number = +match[0];
      const startX = match.index - 1;
      const endX = match.index + match[0].length + 1;
      const startY = y - 1;
      const endY = y + 2;

      // now we are going to check all coordinates around the number
      for (const [x, y] of cartesianRange(startX, endX, startY, endY)) {
        if (x < 0 || x >= line.length || y < 0 || y >= input.length) {
          continue;
        }

        const c = input[y][x];
        // if a symbol was a neighbor, we add this number to the symbol in the
        // symbol map
        if (isSymbol(c)) {
          symbolMap
            .getOrDefault(makeVec2(x, y), () => ({
              symbol: c,
              numbers: [],
            }))
            .numbers.push(number);
        }
      }
    }
  }

  return symbolMap;
}

/**
 * Just returns the sum of all numbers in the symbol map
 */
function solveFirst(symbolMap: SymbolMap) {
  return sum(symbolMap.values().flatMap(({ numbers }) => numbers));
}

/**
 * Returns the sum of all the products of numbers in the symbol map where the
 * symbol is a gear ('*') and it has exactly two numbers as neighbors
 */
function solveSecond(symbolMap: SymbolMap) {
  return sum(
    symbolMap.values().map(({ symbol, numbers }) => {
      if (symbol !== "*" || numbers.length !== 2) {
        return 0;
      }
      return numbers[0] * numbers[1];
    })
  );
}

export default createSolverWithLineArray(async (lines) => {
  const symbolMap = parse(lines);

  return {
    first: solveFirst(symbolMap),
    second: solveSecond(symbolMap),
  };
});
