import { createSolverWithString } from "../../solution";
import { IntcodeCPU } from "./intcode";

export default createSolverWithString(async (input) => {
  const cpu = new IntcodeCPU(input);

  cpu.writeInput(1);
  cpu.run();
  const first = cpu.output.dequeue();

  cpu.reset();
  cpu.writeInput(2);
  cpu.run();
  const second = cpu.output.dequeue();

  return {
    first,
    second,
  };
});
