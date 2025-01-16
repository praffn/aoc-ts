import { createSolverWithString } from "../../solution";
import { IntcodeCPU } from "./intcode";

export default createSolverWithString(async (input) => {
  const firstCPU = new IntcodeCPU(input);
  firstCPU.debug = true;
  firstCPU.setInput(1);

  const secondCPU = new IntcodeCPU(input);
  secondCPU.setInput(5);

  return {
    first: firstCPU.run()!,
    second: secondCPU.run()!,
  };
});
