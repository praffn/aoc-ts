export type Registers = Array<number>;
export type OpcodeFn = (
  a: number,
  b: number,
  c: number,
  registers: Registers
) => void;

export const OPCODES: Record<string, OpcodeFn> = {
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

function n(s: string) {
  return Number.parseInt(s);
}

export function run(program: Array<string>, registers: Array<number>) {
  let ip = 0;
  let ipRegister = -1;

  if (program[0].startsWith("#ip")) {
    ipRegister = n(program[0].split(" ")[1]);
    program = program.slice(1);
  }

  while (ip >= 0 && ip < program.length) {
    if (ipRegister >= 0) {
      registers[ipRegister] = ip;
    }

    // Optimizes the loop that finds the sum of divisors of a number
    if (ip == 2 && registers[4] !== 0) {
      while (registers[4] <= registers[2]) {
        if (registers[2] % registers[4] === 0) {
          registers[0] += registers[4];
        }
        registers[4]++;
      }

      ip = 13;
      continue;
    }

    const [op, a, b, c] = program[ip].split(" ");
    const fn = OPCODES[op];
    fn(n(a), n(b), n(c), registers);

    if (ipRegister >= 0) {
      ip = registers[ipRegister];
    }

    ip++;
  }

  return registers;
}
