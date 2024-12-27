import { createSolverWithLineArray } from "../../solution";
import { AssemBunnyCPU } from "./assembunny";

const MAX_RUN = 1_000;
function solve(cpu: AssemBunnyCPU) {
  let a = 0;
  while (true) {
    cpu.reset({ a });
    let expected = 0;
    let n = 0;
    for (const output of cpu.runWithOutput()) {
      if (output !== expected) {
        break;
      }
      expected = 1 - expected;

      if (n++ > MAX_RUN) {
        return a;
      }
    }
    a++;
  }
}

export default createSolverWithLineArray(async (input) => {
  const cpu = new AssemBunnyCPU(input.map((line) => line.split(" ")));

  return {
    first: solve(cpu),
    second: "Merry Christmas! 🎄",
  };
});
