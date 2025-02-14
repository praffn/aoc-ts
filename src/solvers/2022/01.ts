import { sum } from "../../lib/iter";
import { createSolverWithString } from "../../solution";

function parse(input: string): Array<number> {
  const chunks = input.split("\n\n");

  return chunks.map((line) => {
    const calories = line.split("\n").map((n) => Number.parseInt(n, 10));
    return sum(calories);
  });
}

export default createSolverWithString(async (input) => {
  const calories = parse(input).sort((a, b) => b - a);

  return {
    first: calories[0],
    second: sum(calories.slice(0, 3)),
  };
});
