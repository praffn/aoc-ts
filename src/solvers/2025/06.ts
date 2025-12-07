import { maxBy, numericProduct, slidingWindow, sum, zip } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

interface Problem {
  op: "+" | "*";
  numbers: Array<string>;
}

export function parse(input: Array<string>): Array<Problem> {
  // First, lets find the indices where all characters are just space.
  // Those indices represent the actual breakpoints of the columns;
  const indices = [-1];
  for (let i = 0; i < input[0].length; i++) {
    if (input.every((line) => line[i] === " ")) {
      indices.push(i);
    }
  }
  indices.push(input[0].length);

  // Now we know the break indices
  // Now lets get each column, preserving whitespace
  const columns = Array.from(slidingWindow(indices, 2)).map(
    ([fromIdx, toIdx]) => input.map((line) => line.slice(fromIdx + 1, toIdx))
  );

  // Lets figure out the op and return the columns as proper problems
  return columns.map((column) => {
    const numbers = column.slice(0, -1);
    const op = column.at(-1)!.trim() as Problem["op"];

    return {
      op,
      numbers,
    };
  });
}

function solveFirst(problems: Array<Problem>): number {
  let result = 0;

  for (const problem of problems) {
    const numbers = problem.numbers.map((n) => Number.parseInt(n));

    if (problem.op === "+") {
      result += sum(numbers);
    } else {
      result += numericProduct(numbers);
    }
  }

  return result;
}

function solveSecond(problems: Array<Problem>): number {
  let result = 0;

  for (const problem of problems) {
    const numberLength = problem.numbers[0].length;

    // Construct the cephalopod numbers:
    const cephalopodNumbers = Array.from({ length: numberLength }, (_, i) => {
      const digits = problem.numbers
        .map((n) => n[numberLength - i - 1])
        .join("")
        .trim();

      return Number.parseInt(digits, 10);
    });

    // And do the math
    if (problem.op === "+") {
      result += sum(cephalopodNumbers);
    } else {
      result += numericProduct(cephalopodNumbers);
    }
  }

  return result;
}

export default createSolverWithLineArray(async (input) => {
  const problems = parse(input);

  return {
    first: solveFirst(problems),
    second: solveSecond(problems),
  };
});
