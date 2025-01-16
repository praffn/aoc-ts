import { createSolverWithString } from "../../solution";
import { IntcodeCPU } from "./intcode";

function solveFirst(input: string) {
  const cpu = new IntcodeCPU(input);
  cpu.set(1, 12);
  cpu.set(2, 2);
  cpu.run();
  return cpu.get(0);
}

function solveSecond(input: string) {
  for (let noun = 0; noun <= 99; noun++) {
    for (let verb = 0; verb <= 99; verb++) {
      const cpu = new IntcodeCPU(input);
      cpu.set(1, noun);
      cpu.set(2, verb);
      cpu.run();

      if (cpu.get(0) === 19690720) {
        return 100 * noun + verb;
      }
    }
  }

  throw new Error("No solution found");
}

export default createSolverWithString(async (input) => {
  return {
    first: solveFirst(input),
    second: solveSecond(input),
  };
});
