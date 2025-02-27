import { sum } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

const cardinalReplacements = {
  one: "o1e",
  two: "t2o",
  three: "t3e",
  four: "f4r",
  five: "f5e",
  six: "s6x",
  seven: "s7n",
  eight: "e8t",
  nine: "n9e",
};

/**
 * Replaces all occurrences of cardinal number ("one", "four" etc) with the
 * numeric value ("1", "4" etc). Keeps the first and last letter of the number
 * since those letters can be part of subsequent replacements
 */
function replaceCardinals(line: string) {
  for (const [cardinal, replacement] of Object.entries(cardinalReplacements)) {
    line = line.replaceAll(cardinal, replacement);
  }
  return line;
}

/**
 * Combines the first and last digit in the string, and returns their numeric
 * value. If no digits in the string 0 is returned
 */
function combineFirstAndLastDigit(line: string) {
  const digits = line.replace(/[A-Za-z]/g, "").split("");
  if (digits.length === 0) return 0;
  return +(digits.at(0)! + digits.at(-1)!);
}

/**
 * Returns the sum of the first and last digit of each line in the input
 */
function calibrate(input: Array<string>) {
  return sum(input.map(combineFirstAndLastDigit));
}

export default createSolverWithLineArray(async (input) => {
  return {
    first: calibrate(input),
    second: calibrate(input.map(replaceCardinals)),
  };
});
