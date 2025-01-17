import { permutations } from "../../lib/iter";
import { createSolverWithString } from "../../solution";
import { HALT_WAITING, IntcodeCPU, makeMemory, type Memory } from "./intcode";

function solveFirst(memory: Memory) {
  const cpu = new IntcodeCPU(memory);
  let maxOutput = -1;

  // Try all permutations of the phase settings, and find the maximum output
  for (const sequence of permutations([0, 1, 2, 3, 4])) {
    let lastOutput = 0;
    for (const s of sequence) {
      cpu.reset();
      cpu.writeInput(s);
      cpu.writeInput(lastOutput);
      cpu.run();
      lastOutput = cpu.lastOutput();
    }
    maxOutput = Math.max(maxOutput, lastOutput);
  }

  return maxOutput;
}

function solveSecond(memory: Memory) {
  let maxOutput = -1;

  // Kind of the same as before, iterate through all permutations of the phase
  // settings, but this time we need to keep the CPUs running in a loop.
  for (const sequence of permutations([5, 6, 7, 8, 9])) {
    // For each phase setting, create a CPU and write the phase setting to it
    const cpus = sequence.map((id) => {
      const cpu = new IntcodeCPU(memory);
      cpu.writeInput(id);
      return cpu;
    });

    // Keep track of output of latest run of a CPU. Initially set to 0
    let lastOutput = 0;
    // Run the CPUs in a loop until all of them terminate
    while (cpus.length > 0) {
      // Get the LIFO CPU
      const cpu = cpus.shift()!;
      // Write output from previous CPU
      cpu.writeInput(lastOutput);
      // And run it. If it does NOT terminate, but waits for input, push it back
      if (cpu.run() === HALT_WAITING) {
        cpus.push(cpu);
      }

      // Finally get the output
      lastOutput = cpu.removeFirstOutput();
    }

    // All machines have terminated, so we can get the output from the last one
    maxOutput = Math.max(maxOutput, lastOutput);
  }

  return maxOutput;
}

export default createSolverWithString(async (input) => {
  const initialMemory = makeMemory(input);

  return {
    first: solveFirst(initialMemory),
    second: solveSecond(initialMemory),
  };
});
