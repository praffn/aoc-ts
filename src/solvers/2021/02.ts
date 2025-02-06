import { createSolverWithLineArray } from "../../solution";

function follow(instructions: Array<string>): [number, number] {
  // used for solving first part
  let horizontal = 0;
  let depth = 0;
  // used for solving second part
  let aim = 0;
  let depthWithAim = 0;

  for (const instruction of instructions) {
    const [movement, amountStr] = instruction.split(" ");
    const amount = Number.parseInt(amountStr, 10);

    switch (movement) {
      case "forward":
        horizontal += amount;
        depthWithAim += aim * amount;
        break;
      case "down":
        depth += amount;
        aim += amount;
        break;
      case "up":
        depth -= amount;
        aim -= amount;
        break;
    }
  }

  return [horizontal * depth, horizontal * depthWithAim];
}

export default createSolverWithLineArray(async (input) => {
  const [first, second] = follow(input);

  return { first, second };
});
