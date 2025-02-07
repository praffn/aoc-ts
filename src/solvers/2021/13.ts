import { StructuralSet } from "../../lib/collections/structural-set";
import { key, makeVec2, type Vec2 } from "../../lib/linalg/vec2";
import { createSolverWithString } from "../../solution";

/**
 * Takes a set of points, an axis to fold along and a value to fold at.
 * Returns a new set of points where each point is folded along the axis.
 */
function fold(
  dots: StructuralSet<Vec2>,
  axis: string,
  value: number
): StructuralSet<Vec2> {
  return new StructuralSet(
    key,
    [...dots].map(({ x, y }) => {
      const nx = axis === "x" ? Math.min(x, 2 * value - x) : x;
      const ny = axis === "y" ? Math.min(y, 2 * value - y) : y;
      return makeVec2(nx, ny);
    })
  );
}

/**
 * Parses the input and returns a pair of the initial set of dots and an array
 * of the fold instructions.
 */
function parse(input: string): [StructuralSet<Vec2>, Array<[string, number]>] {
  const [rawDots, rawInstructions] = input
    .split("\n\n")
    .map((lines) => lines.split("\n"));

  const dots = new StructuralSet(
    key,
    rawDots.map((line) => {
      const [x, y] = line.split(",");
      return makeVec2(Number.parseInt(x, 10), Number.parseInt(y, 10));
    })
  );

  const instructions = rawInstructions.map((line) => {
    const [axis, value] = line.split(" ").at(-1)!.split("=");
    return [axis, Number.parseInt(value, 10)] as [string, number];
  });

  return [dots, instructions];
}

/**
 * Outputs the dots to the console.
 */
function printDots(dots: StructuralSet<Vec2>) {
  const minX = Math.min(...dots.values().map(({ x }) => x));
  const maxX = Math.max(...dots.values().map(({ x }) => x));
  const minY = Math.min(...dots.values().map(({ y }) => y));
  const maxY = Math.max(...dots.values().map(({ y }) => y));

  for (let y = minY; y <= maxY; y++) {
    let line = "";
    for (let x = minX; x <= maxX; x++) {
      line += dots.has(makeVec2(x, y)) ? "█" : " ";
    }
    console.log(line);
  }
}

export default createSolverWithString(async (input, extra) => {
  const [dots, instructions] = parse(input);

  const dotsAfterFirstFold = fold(dots, ...instructions[0]);

  if (extra) {
    const finalFold = instructions.reduce(
      (dots, instruction) => fold(dots, ...instruction),
      dots
    );

    printDots(finalFold);
  }

  return {
    first: dotsAfterFirstFold.size,
    second: extra ? "See above" : "Add -x to see output",
  };
});
