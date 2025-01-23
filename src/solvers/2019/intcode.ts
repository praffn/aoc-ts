import { Queue } from "../../lib/collections/queue";

export type Memory = Array<number>;

type Mode = 0 | 1 | 2;
const MODE_POSITION: Mode = 0;
const MODE_IMMEDIATE: Mode = 1;
const MODE_RELATIVE: Mode = 2;

export type HaltType = "terminated" | "waiting" | "error";
export const HALT_TERMINATED: HaltType = "terminated";
export const HALT_WAITING: HaltType = "waiting";

const OPCODE_ADD = 1;
const OPCODE_MUL = 2;
const OPCODE_INP = 3;
const OPCODE_OUT = 4;
const OPCODE_JNZ = 5;
const OPCODE_JZ = 6;
const OPCODE_LT = 7;
const OPCODE_EQ = 8;
const OPCODE_REL = 9;
const OPCODE_HLT = 99;

export class IntcodeCPU {
  readonly #program: Memory;
  #memory: Memory;
  #ip = 0;
  #relativeBase = 0;
  debug = false;

  input = new Queue<number>();
  output = new Queue<number>();

  constructor(program: string);
  constructor(memory: Memory);
  constructor(programOrMemory: string | Memory) {
    this.#program =
      typeof programOrMemory === "string"
        ? makeMemory(programOrMemory)
        : programOrMemory;
    this.#memory = copyMemory(this.#program);
    this.#memory.push(...new Array(5000).fill(0));
  }

  /**
   * Resets the CPU to the initial state. Memory is restored to the original
   * program, instruction pointer is reset and input/output queues are cleared.
   */
  reset() {
    this.#memory = copyMemory(this.#program);
    this.#memory.push(...new Array(5000).fill(0));
    this.#ip = 0;
    this.#relativeBase = 0;
    this.input.clear();
    this.output.clear();
  }

  clone() {
    const clone = new IntcodeCPU(this.#program);
    clone.#memory = copyMemory(this.#memory);
    clone.#ip = this.#ip;
    clone.#relativeBase = this.#relativeBase;
    clone.input = this.input.clone();
    clone.output = this.output.clone();

    return clone;
  }

  #log(...args: any[]) {
    if (this.debug) {
      console.log(...args);
    }
  }

  /**
   * Writes the given values to the input queue.
   * The values will be read in order
   */
  writeInput(value: number): void;
  writeInput(values: Array<number>): void;
  writeInput(value: number | Array<number>): void {
    const values = Array.isArray(value) ? value : [value];
    this.input.enqueueAll(values);
  }

  /**
   * Returns the value in memory at the given address
   */
  getMemory(addr: number): number {
    return this.#memory[addr];
  }

  /**
   * Writes the given value to memory at the given address
   */
  setMemory(addr: number, value: number) {
    this.#memory[addr] = value;
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

  #read(addr: number, mode: Mode): number {
    const value = this.#memory[addr];

    switch (mode) {
      case MODE_IMMEDIATE:
        return value ?? 0;
      case MODE_POSITION:
        return this.#memory[value];
      case MODE_RELATIVE:
        return this.#memory[value + this.#relativeBase];
      default:
        throw new Error(`Invalid mode: ${mode}`);
    }
  }

  #write(addr: number, mode: Mode, value: number) {
    const target = this.#memory[addr];

    switch (mode) {
      case MODE_IMMEDIATE:
      case MODE_POSITION:
        this.#memory[target] = value;
        break;
      case MODE_RELATIVE:
        this.#memory[this.#relativeBase + target] = value;
        break;
    }
  }

  //#region OPCODES

  #opAdd(m1: Mode, m2: Mode, m3: Mode) {
    const a = this.#read(this.#ip + 1, m1);
    const b = this.#read(this.#ip + 2, m2);
    const result = a + b;
    this.#log(`\tADD: ${a} + ${b} (${result})`);

    this.#write(this.#ip + 3, m3, result);
    this.#ip += 4;
  }

  #opMul(m1: Mode, m2: Mode, m3: Mode) {
    const a = this.#read(this.#ip + 1, m1);
    const b = this.#read(this.#ip + 2, m2);
    const result = a * b;
    this.#log(`\tMUL: ${a} * ${b} (${result})`);

    this.#write(this.#ip + 3, m3, result);

    this.#ip += 4;
  }

  #opInp(m1: Mode) {
    if (this.input.isEmpty()) {
      this.#log(`\tINP: Waiting for input`);
      return HALT_WAITING;
    }
    const input = this.input.dequeue();
    this.#log(`\tINP: ${input}`);

    this.#write(this.#ip + 1, m1, input);

    this.#ip += 2;
  }

  #opOut(m1: Mode) {
    const output = this.#read(this.#ip + 1, m1);
    this.#log(`\tOUT: ${output}`);
    this.output.enqueue(output);

    this.#ip += 2;
  }

  #opJnz(m1: Mode, m2: Mode) {
    const value = this.#read(this.#ip + 1, m1);
    const addr = this.#read(this.#ip + 2, m2);

    if (value !== 0) {
      this.#log(`\tJNZ: ${value} != 0  | JUMPING TO ${addr}`);
      this.#ip = addr;
    } else {
      this.#log(`\tJNZ: ${value} != 0  | NOT JUMPING`);
      this.#ip += 3;
    }
  }

  #opJz(m1: Mode, m2: Mode) {
    const value = this.#read(this.#ip + 1, m1);
    const addr = this.#read(this.#ip + 2, m2);

    if (value === 0) {
      this.#log(`\tJZ : ${value} == 0  | JUMPING TO ${addr}`);
      this.#ip = addr;
    } else {
      this.#log(`\tJZ : ${value} == 0  | NOT JUMPING`);
      this.#ip += 3;
    }
  }

  #opLt(m1: Mode, m2: Mode, m3: Mode) {
    const a = this.#read(this.#ip + 1, m1);
    const b = this.#read(this.#ip + 2, m2);
    const result = a < b ? 1 : 0;
    this.#log(`\tLT : ${a} < ${b} (${result})`);

    this.#write(this.#ip + 3, m3, result);
    this.#ip += 4;
  }

  #opEq(m1: Mode, m2: Mode, m3: Mode) {
    const a = this.#read(this.#ip + 1, m1);
    const b = this.#read(this.#ip + 2, m2);
    const result = a === b ? 1 : 0;
    this.#log(`\tEQ : ${a} == ${b} (${result})`);

    this.#write(this.#ip + 3, m3, result);
    this.#ip += 4;
  }

  #opRel(m1: Mode) {
    const offset = this.#read(this.#ip + 1, m1);
    this.#relativeBase += offset;
    this.#log(`\tREL: Relative base is now ${this.#relativeBase}`);

    this.#ip += 2;
  }

  #opHlt() {
    this.#log(`\tHLT: Stopping execution`);
    return HALT_TERMINATED;
  }

  //#endregion

  /**
   * Executes the next instruction in the program.
   * Returns a HaltType in case of program termination or waiting for input.
   * Otherwise, returns void.
   */
  step(): HaltType | void {
    const [opcode, m1, m2, m3] = this.#decode(this.#memory[this.#ip]);
    this.#log(`OPCODE: ${opcode} [IP: ${this.#ip}] | modes: ${m1} ${m2} ${m3}`);

    switch (opcode) {
      case OPCODE_ADD:
        return this.#opAdd(m1, m2, m3);
      case OPCODE_MUL:
        return this.#opMul(m1, m2, m3);
      case OPCODE_INP:
        return this.#opInp(m1);
      case OPCODE_OUT:
        return this.#opOut(m1);
      case OPCODE_JNZ:
        return this.#opJnz(m1, m2);
      case OPCODE_JZ:
        return this.#opJz(m1, m2);
      case OPCODE_LT:
        return this.#opLt(m1, m2, m3);
      case OPCODE_EQ:
        return this.#opEq(m1, m2, m3);
      case OPCODE_REL:
        return this.#opRel(m1);
      case OPCODE_HLT:
        return this.#opHlt();
      default:
        throw new Error(
          `Invalid opcode: ${opcode}, IP: ${this.#ip} [${
            this.#memory[this.#ip]
          }]`
        );
    }
  }

  /**
   * Continuously runs the CPU until it halts, either by termination or waiting
   * for input. If waiting for input you can supply it and call run again.
   */
  run(): HaltType {
    while (true) {
      const haltType = this.step();
      if (haltType) {
        return haltType;
      }
    }
  }
}

export function makeMemory(input: string): Memory {
  return input.split(",").map((x) => parseInt(x, 10));
}

export function copyMemory(memory: Memory): Memory {
  return memory.slice();
}
