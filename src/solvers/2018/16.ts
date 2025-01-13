import { range } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

type Instruction = [number, number, number, number];
type Registers = [number, number, number, number];

type OpcodeFn = (a: number, b: number, c: number, registers: Registers) => void;

type Snapshot = {
  before: Registers;
  after: Registers;
  instruction: Instruction;
};

const OPCODES: Record<string, OpcodeFn> = {
  addr(a: number, b: number, c: number, registers: Registers) {
    registers[c] = registers[a] + registers[b];
  },

  addi(a: number, b: number, c: number, registers: Registers) {
    registers[c] = registers[a] + b;
  },

  mulr(a: number, b: number, c: number, registers: Registers) {
    registers[c] = registers[a] * registers[b];
  },

  muli(a: number, b: number, c: number, registers: Registers) {
    registers[c] = registers[a] * b;
  },

  banr(a: number, b: number, c: number, registers: Registers) {
    registers[c] = registers[a] & registers[b];
  },

  bani(a: number, b: number, c: number, registers: Registers) {
    registers[c] = registers[a] & b;
  },

  borr(a: number, b: number, c: number, registers: Registers) {
    registers[c] = registers[a] | registers[b];
  },

  bori(a: number, b: number, c: number, registers: Registers) {
    registers[c] = registers[a] | b;
  },

  setr(a: number, b: number, c: number, registers: Registers) {
    registers[c] = registers[a];
  },

  seti(a: number, b: number, c: number, registers: Registers) {
    registers[c] = a;
  },

  gtir(a: number, b: number, c: number, registers: Registers) {
    registers[c] = a > registers[b] ? 1 : 0;
  },

  gtri(a: number, b: number, c: number, registers: Registers) {
    registers[c] = registers[a] > b ? 1 : 0;
  },

  gtrr(a: number, b: number, c: number, registers: Registers) {
    registers[c] = registers[a] > registers[b] ? 1 : 0;
  },

  eqir(a: number, b: number, c: number, registers: Registers) {
    registers[c] = a === registers[b] ? 1 : 0;
  },

  eqri(a: number, b: number, c: number, registers: Registers) {
    registers[c] = registers[a] === b ? 1 : 0;
  },

  eqrr(a: number, b: number, c: number, registers: Registers) {
    registers[c] = registers[a] === registers[b] ? 1 : 0;
  },
};

function registersEqual(a: Registers, b: Registers) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

/**
 * Returns true if the registers equals the snapshot registers after running
 */
function check(opcodeFn: OpcodeFn, snapshot: Snapshot) {
  const { before, after, instruction } = snapshot;
  const [, a, b, c] = instruction;

  const copy = [...before] as Registers;
  opcodeFn(a, b, c, copy);

  return registersEqual(after, copy);
}

/**
 * Returns the byte -> opcode mapping given the snapshots
 */
function figureOutOpcodes(snapshots: Array<Snapshot>) {
  // Initialize all opcodes to all possible values
  // In short, all opcodes can be any of the 16 values
  const possibilities = new Map(
    Object.keys(OPCODES).map((opcode) => [opcode, new Set(range(16))])
  );

  // Now lets check all snapshots and remove the opcodes that don't match
  for (const snapshot of snapshots) {
    for (const [opcode, opcodeFn] of Object.entries(OPCODES)) {
      if (!check(opcodeFn, snapshot)) {
        possibilities.get(opcode)!.delete(snapshot.instruction[0]);
      }
    }
  }

  // Assumption here is that after the previous step there will be at least ONE
  // opcode with just a single possible value. Until we have resolved all opcodes
  // we go through the possibilities and remove the values that are already resolved
  const opcodeMapping = new Map<number, string>();
  while (opcodeMapping.size < 16) {
    for (const [opcode, possible] of possibilities) {
      if (possible.size === 1) {
        const value = [...possible][0];
        opcodeMapping.set(value, opcode);
        for (const [, other] of possibilities) {
          other.delete(value);
        }
      }
    }
  }

  return opcodeMapping;
}

/**
 * Returns the count of snapshots where 3 or more opcode fns could
 * have produced the resulting registers
 */
function solveFirst(snapshots: Array<Snapshot>) {
  let count = 0;

  for (const snapshot of snapshots) {
    let possible = 0;
    for (const opcodeFn of Object.values(OPCODES)) {
      if (check(opcodeFn, snapshot)) {
        possible++;
        if (possible >= 3) {
          break;
        }
      }
    }
    if (possible >= 3) {
      count++;
    }
  }

  return count;
}

/**
 * Figures out the opcodes and then runs the program, returning whatever value
 * is in the first register after the program has run
 */
function solveSecond(
  opcodeInstructions: Map<number, string>,
  instructions: Array<Instruction>
) {
  let registers: Registers = [0, 0, 0, 0];

  for (const instruction of instructions) {
    const [opcode, a, b, c] = instruction;
    const opcodeFn = OPCODES[opcodeInstructions.get(opcode)!];
    opcodeFn(a, b, c, registers);
  }

  return registers[0];
}

function parse(lines: Array<String>): [Array<Snapshot>, Array<Instruction>] {
  const snapshots: Array<Snapshot> = [];
  const program: Array<Instruction> = [];
  let finishedParsingSnapshots = false;

  for (let i = 0; i < lines.length; i++) {
    if (finishedParsingSnapshots) {
      program.push(
        lines[i].split(" ").map((n) => Number.parseInt(n)) as Instruction
      );
      continue;
    }

    if (lines[i] === "") {
      i++;
      finishedParsingSnapshots = true;
      continue;
    }

    const before = lines[i + 0]
      .slice(9, lines[i + 0].length - 1)
      .split(", ")
      .map((n) => Number.parseInt(n)) as Registers;

    const instruction = lines[i + 1]
      .split(" ")
      .map((n) => Number.parseInt(n)) as Instruction;

    const after = lines[i + 2]
      .slice(9, lines[i + 2].length - 1)
      .split(", ")
      .map((n) => Number.parseInt(n)) as Registers;

    i += 3;

    snapshots.push({
      before,
      instruction,
      after,
    });
  }

  return [snapshots, program];
}

export default createSolverWithLineArray(async (input) => {
  const [snapshots, program] = parse(input);
  const opcodeMapping = figureOutOpcodes(snapshots);

  return {
    first: solveFirst(snapshots),
    second: solveSecond(opcodeMapping, program),
  };
});
