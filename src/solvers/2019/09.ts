import { createSolverWithString } from "../../solution";
import { IntcodeCPU } from "./intcode";

export default createSolverWithString(async (input) => {
  const cpu = new IntcodeCPU(input);

  cpu.writeInput(1);
  cpu.run();
  const first = cpu.removeFirstOutput();

  cpu.reset();
  cpu.writeInput(2);
  cpu.run();
  const second = cpu.removeFirstOutput();

  return {
    first,
    second,
  };
});
