import { createSolverWithLineArray } from "../../solution";
import { AssemBunnyCPU } from "./assembunny";

export default createSolverWithLineArray(async (input) => {
  const instructions = input.map((line) => line.split(" "));
  const cpu = new AssemBunnyCPU(instructions, { a: 7 });
  const first = cpu.run();
  cpu.reset({ a: 12 });
  const second = cpu.run();
  return {
    first,
    second,
  };
});
