import { createSolverWithString } from "../../solution";

export function climb(input: string): [number, number] {
  let floor = 0;
  let basementIndex = -1;

  for (let i = 0; i < input.length; i++) {
    if (input[i] === "(") {
      floor++;
    } else {
      floor--;
    }

    if (floor === -1 && basementIndex === -1) {
      basementIndex = i + 1;
    }
  }

  return [floor, basementIndex];
}

export default createSolverWithString(async (input) => {
  const [first, second] = climb(input);

  return {
    first,
    second,
  };
});
