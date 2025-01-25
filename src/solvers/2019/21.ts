import { createSolverWithString } from "../../solution";
import { IntcodeCPU } from "./intcode";

export default createSolverWithString(async (input) => {
  const cpu = new IntcodeCPU(input);

  const firstScript = [
    "OR A J",
    "AND B J",
    "AND C J",
    "NOT J J",
    "AND D J",
    "WALK",
    "",
  ];

  cpu.writeInputString(firstScript.join("\n"));
  cpu.run();
  const first = cpu.output.peekLast();
  cpu.reset();

  const secondScript = [
    "OR A J",
    "AND B J",
    "AND C J",
    "NOT J J",
    "AND D J",
    "OR E T",
    "OR H T",
    "AND T J",
    "RUN",
    "",
  ];

  cpu.writeInputString(secondScript.join("\n"));
  cpu.run();
  const second = cpu.output.peekLast();

  return {
    first,
    second,
  };
});
