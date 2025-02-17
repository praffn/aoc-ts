import { enumerate } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

/**
 * Parses the instructions into a list of numbers.
 * We can act like there only is ONE instruction `addx` and that instead of two
 * clock cycles it only takes one. Then we can turn `noop` into 0, and an
 * `addx n` into [0, n]. That way the index of a number is also the current
 * cycle (-1).
 */
function parseInstructions(input: Array<string>) {
  return input.flatMap((line) => {
    if (line === "noop") {
      // we turn `noop` into `addx 0`
      return 0;
    }

    // and we turn `addx n` into `addx 0; addx n`
    return [0, Number.parseInt(line.split(" ")[1])];
  });
}

/**
 * Returns true if -1 >= (p-x) <= 1
 * I.e. p is at max 1 distance from x
 */
function inRange(p: number, x: number) {
  const d = Math.abs(p - x);
  return d === 0 || d === 1;
}

export default createSolverWithLineArray(async (input, extra) => {
  const numbers = parseInstructions(input);

  let x = 1;
  let nextCheckpoint = 20;
  let signalSum = 0;

  let pixel = 0;
  let screen = "";

  for (const [cycle, n] of enumerate(numbers, 1)) {
    if (cycle === nextCheckpoint) {
      signalSum += x * cycle;
      nextCheckpoint += 40;
    }

    screen += inRange(pixel, x) ? "█" : " ";
    pixel++;
    if (pixel % 40 === 0) {
      screen += "\n";
      pixel = 0;
    }

    x += n;
  }

  if (extra) {
    console.log(screen);
  }

  return {
    first: signalSum,
    second: extra ? "Look above" : "-x to see the screen",
  };
});
