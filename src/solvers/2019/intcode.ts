export type Memory = Array<number>;

export function makeMemory(input: string): Memory {
  return input.split(",").map((x) => parseInt(x, 10));
}

type Mode = 0 | 1;
const MODE_POSITION: Mode = 0;
const MODE_IMMEDIATE: Mode = 1;

export class IntcodeCPU {
  #memory: Memory;
  #ip = 0;
  #input = 0;
  #output: Array<number> = [];
  debug = false;

  constructor(program: string);
  constructor(memory: Memory);
  constructor(programOrMemory: string | Memory) {
    const memory =
      typeof programOrMemory === "string"
        ? makeMemory(programOrMemory)
        : programOrMemory;

    this.#memory = copyMemory(memory);
  }

  log(...args: any[]) {
    if (this.debug) {
      console.log(...args);
    }
  }

  setInput(input: number) {
    this.#input = input;
  }

  get(n: number): number {
    return this.#memory[n];
  }

  set(n: number, value: number) {
    this.#memory[n] = value;
  }

  #decode(opcode: number): [number, Mode, Mode, Mode] {
    const modes = Math.floor(opcode / 100);
    opcode = opcode % 100;

    return [
      opcode,
      (modes % 10) as Mode,
      (Math.floor(modes / 10) % 10) as Mode,
      (Math.floor(modes / 100) % 10) as Mode,
    ];
  }

  #read(n: number, mode: Mode): number {
    return mode === MODE_POSITION ? this.#memory[n] : n;
  }

  step() {
    const [opcode, m1, m2, m3] = this.#decode(this.#memory[this.#ip]);
    this.log(`OPCODE: ${opcode} [IP: ${this.#ip}] | modes: ${m1} ${m2} ${m3}`);
    switch (opcode) {
      // ADD
      case 1: {
        const a = this.#read(this.#memory[this.#ip + 1], m1);
        const b = this.#read(this.#memory[this.#ip + 2], m2);
        const result = a + b;
        const target = this.#memory[this.#ip + 3];
        this.log(`\tADD: ${target} = ${a} + ${b} (${result})`);

        this.#memory[target] = result;
        this.#ip += 4;
        break;
      }
      // MUL
      case 2: {
        const a = this.#read(this.#memory[this.#ip + 1], m1);
        const b = this.#read(this.#memory[this.#ip + 2], m2);
        const result = a * b;
        const target = this.#memory[this.#ip + 3];
        this.log(`\tMUL: ${target} = ${a} * ${b} (${result})`);

        this.#memory[target] = result;
        this.#ip += 4;
        break;
      }
      // INPUT
      case 3: {
        const input = this.#input;
        const target = this.#memory[this.#ip + 1];
        this.log(`\tINP: ${target} = ${input}`);

        this.#memory[target] = input;
        this.#ip += 2;
        break;
      }
      // OUTPUT
      case 4: {
        const output = this.#read(this.#memory[this.#ip + 1], m1);
        this.log(`\tOUT: ${output}`);

        this.#output.push(output);
        this.#ip += 2;
        break;
      }
      // JUMP-IF-TRUE
      case 5: {
        const value = this.#read(this.#memory[this.#ip + 1], m1);
        const addr = this.#read(this.#memory[this.#ip + 2], m2);

        if (value !== 0) {
          this.log(`\tJNZ: ${value} != 0  | JUMPING TO ${addr}`);
          this.#ip = addr;
        } else {
          this.log(`\tJNZ: ${value} != 0  | NOT JUMPING`);
          this.#ip += 3;
        }
        break;
      }
      // JUMP-IF-FALSE
      case 6: {
        const value = this.#read(this.#memory[this.#ip + 1], m1);
        const addr = this.#read(this.#memory[this.#ip + 2], m2);

        if (value === 0) {
          this.log(`\tJZ : ${value} == 0  | JUMPING TO ${addr}`);
          this.#ip = addr;
        } else {
          this.log(`\tJZ : ${value} == 0  | NOT JUMPING`);
          this.#ip += 3;
        }
        break;
      }
      // LESS THAN
      case 7: {
        const a = this.#read(this.#memory[this.#ip + 1], m1);
        const b = this.#read(this.#memory[this.#ip + 2], m2);
        const target = this.#memory[this.#ip + 3];
        const result = a < b ? 1 : 0;
        this.log(`\tLT : ${target} = ${a} < ${b} (${result})`);

        this.#memory[target] = result;
        this.#ip += 4;
        break;
      }
      // EQUALS
      case 8: {
        const a = this.#read(this.#memory[this.#ip + 1], m1);
        const b = this.#read(this.#memory[this.#ip + 2], m2);
        const target = this.#memory[this.#ip + 3];
        const result = a === b ? 1 : 0;
        this.log(`\tEQ : ${target} = ${a} == ${b} (${result})`);

        this.#memory[target] = result;
        this.#ip += 4;
        break;
      }
      // HALT
      case 99:
        this.log(`\tHLT: Stopping execution`);
        return false;
      default:
        throw new Error(
          `Invalid opcode: ${opcode}, IP: ${this.#ip} [${
            this.#memory[this.#ip]
          }]`
        );
    }

    return true;
  }

  run() {
    while (this.#ip < this.#memory.length) {
      if (!this.step()) {
        break;
      }
    }

    return this.#output.at(-1);
  }
}

export function copyMemory(memory: Memory): Memory {
  return memory.slice();
}
