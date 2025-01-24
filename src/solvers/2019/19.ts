import { range } from "../../lib/iter";
import { createSolverWithString } from "../../solution";
import { IntcodeCPU } from "./intcode";

function getReading(cpu: IntcodeCPU, x: number, y: number) {
  cpu.reset();
  cpu.writeInput(x);
  cpu.writeInput(y);
  cpu.run();
  return cpu.output.peek();
}

export default createSolverWithString(async (input) => {
  const cpu = new IntcodeCPU(input);

  // simply get reading for the 50x50 area
  let first = 0;
  for (const x of range(50)) {
    for (const y of range(50)) {
      first += getReading(cpu, x, y);
    }
  }

  // find the first 100x100 area that fits the beam
  let x = 0;
  let y = 0;
  while (!getReading(cpu, x + 99, y)) {
    y++;
    while (!getReading(cpu, x, y + 99)) {
      x++;
    }
  }

  return {
    first: first,
    second: x * 10_000 + y,
  };
});
