import { createSolverWithString } from "../../solution";

export function lookAndSay(input: string) {
  let result = "";

  let count = 1;
  let current = input[0];

  for (let i = 1; i < input.length; i++) {
    if (input[i] === current) {
      count++;
    } else {
      result += count.toString() + current;
      count = 1;
      current = input[i];
    }
  }

  result += count.toString() + current;

  return result;
}

function run(input: string, times: number) {
  for (let i = 0; i < times; i++) {
    input = lookAndSay(input);
  }

  return input;
}

export default createSolverWithString(async (input) => {
  const after40Times = run(input, 40);
  const after50Times = run(after40Times, 10);

  return {
    first: after40Times.length,
    second: after50Times.length,
  };
});
