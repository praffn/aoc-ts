import { createSolverWithString } from "../../solution";
import { IntcodeCPU } from "./intcode";

export default createSolverWithString(async (input) => {
  const firstCPU = new IntcodeCPU(input);
  firstCPU.writeInput(1);
  firstCPU.run();

  const secondCPU = new IntcodeCPU(input);
  secondCPU.writeInput(5);
  secondCPU.run();

  return {
    first: firstCPU.output.peek(),
    second: secondCPU.output.peek(),
  };
});
