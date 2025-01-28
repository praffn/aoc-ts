import { createSolverWithLineArray } from "../../solution";

function parse(input: Array<string>): Array<[string, number]> {
  return input.map((line) => {
    const [op, arg] = line.split(" ");
    return [op, Number.parseInt(arg)];
  });
}

function run(program: Array<[string, number]>): {
  success: boolean;
  accumulator: number;
  trace: Array<boolean>;
} {
  const programLength = program.length;
  const trace = Array(programLength).fill(false);
  let accumulator = 0;
  let ip = 0;

  while (ip < programLength) {
    if (trace[ip]) {
      return {
        success: false,
        accumulator,
        trace,
      };
    }
    trace[ip] = true;

    const [op, arg] = program[ip];
    switch (op) {
      case "acc":
        accumulator += arg;
        ip++;
        break;
      case "jmp":
        ip += arg;
        break;
      case "nop":
        ip++;
        break;
      default:
        throw new Error(`Unknown operation: ${op}`);
    }
  }

  return {
    success: true,
    accumulator,
    trace,
  };
}

// Thanks to smmalis37 -- otherwise I would have never solved this
// https://www.reddit.com/r/adventofcode/comments/k8xw8h/comment/gf1du97
function solveSecond(program: Array<[string, number]>) {
  // run the program once, getting the trace
  // the trace is an array of booleans, where each index represents
  // whether the instruction at that index was executed
  const { trace } = run(program);
  const potentialLandingSpots = Array(program.length + 1).fill(false);

  // Alright, lets walk backwards through the program, finding the first
  // jmp instruction that jumps backwards
  let i = program.length;
  while (true) {
    potentialLandingSpots[i] = true;
    i -= 1;

    const [op, arg] = program[i];
    if (op === "jmp" && arg < 0) {
      break;
    }
  }

  // We have to land inside this range of instructions, so lets keep walking
  // backwards and lets look for possible jmp <-> nop swaps
  let start = i;
  let swap = i;
  if (!trace[i]) {
    while (true) {
      i -= 1;
      if (potentialLandingSpots[i]) {
        continue;
      }

      const [op, arg] = program[i];

      if (op === "nop") {
        // a NOP that would have landed us there if it was JMP
        if (trace[i] && potentialLandingSpots[i + arg]) {
          swap = i;
          break;
        }
      } else if (op === "jmp") {
        // a JMP that was not hit, but would have landed us there, and it is
        // preceded by a JMP that was hit (we can swap it to NOP)
        // OR
        // a JMP that was not hit, but would have landed us there, and it is
        // preceded by a JMP that was not hit either.
        if (
          !trace[i] &&
          potentialLandingSpots[i + arg] &&
          !potentialLandingSpots[i]
        ) {
          let j = i - 1;
          while (true) {
            if (program[j][0] === "jmp") {
              break;
            }
            j -= 1;
          }

          if (trace[j]) {
            swap = j;
            break;
          } else {
            for (let k = j + 1; k <= i; k++) {
              potentialLandingSpots[k] = true;
            }
            i = start;
          }
        }
      }
    }
  }

  const [swapOp, swapArg] = program[swap];
  switch (swapOp) {
    case "acc":
      throw new Error("Should not swap acc");
    case "jmp":
      program[swap] = ["nop", swapArg];
      break;
    case "nop":
      program[swap] = ["jmp", swapArg];
      break;
  }

  return run(program).accumulator;
}

export default createSolverWithLineArray(async (input) => {
  const program = parse(input);
  const { accumulator, trace } = run(program);

  return {
    first: accumulator,
    second: solveSecond(program),
  };
});
