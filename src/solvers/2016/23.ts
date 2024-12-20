import { createSolverWithLineArray } from "../../solution";
import { AssemBunnyCPU } from "./assembunny";

export default createSolverWithLineArray(async (input) => {
  const instructions = input.map((line) => line.split(" "));
  const cpu = new AssemBunnyCPU(instructions);

  cpu.registers.a = 7;
  cpu.run();
  const first = cpu.registers.a;
  cpu.reset();
  cpu.registers.a = 12;
  cpu.run();
  const second = cpu.registers.a;

  return {
    first,
    second,
  };
});
