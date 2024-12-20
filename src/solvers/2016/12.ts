import { createSolverWithLineArray } from "../../solution";
import { AssemBunnyCPU } from "./assembunny";

export default createSolverWithLineArray(async (input) => {
  const instructions = input.map((line) => line.split(" "));
  const cpu = new AssemBunnyCPU(instructions);

  const first = cpu.run();
  cpu.reset({ c: 1 });

  const second = cpu.run();
  return {
    first,
    second,
  };
});
