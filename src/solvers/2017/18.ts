import { createSolverWithLineArray } from "../../solution";

class DuetCPU {
  #registers: Record<string, number> = {};
  #instructions: Array<Array<string>>;
  #pc = 0;

  #receiveQueue: Array<number> = [];
  #receiveResolve: ((value: number) => void) | null = null;

  get waiting() {
    return this.#receiveResolve !== null;
  }

  get done() {
    return this.#pc < 0 || this.#pc >= this.#instructions.length;
  }

  #recv(reg: string) {
    if (this.#receiveQueue.length === 0) {
      this.#receiveResolve = (value) => {
        this.#registers[reg] = value;
      };
    } else {
      this.#registers[reg] = this.#receiveQueue.shift()!;
    }
  }

  receive(value: number) {
    if (this.#receiveResolve) {
      this.#receiveResolve(value);
      this.#receiveResolve = null;
    } else {
      this.#receiveQueue.push(value);
    }
  }

  constructor(instructions: Array<string>, id = 0) {
    this.#registers["p"] = id;
    this.#instructions = instructions.map((line) => line.split(" "));
  }

  #value(x: string) {
    if (x >= "a" && x <= "z") {
      return this.#registers[x] || 0;
    }
    return Number.parseInt(x, 10);
  }

  tick() {
    if (this.done || this.waiting) {
      return;
    }

    const [op, x, y] = this.#instructions[this.#pc++];
    switch (op) {
      case "snd":
        return this.#value(x);
      case "set":
        this.#registers[x] = this.#value(y);
        break;
      case "add":
        this.#registers[x] = (this.#registers[x] ?? 0) + this.#value(y);
        break;
      case "mul":
        this.#registers[x] = (this.#registers[x] ?? 0) * this.#value(y);
        break;
      case "mod":
        this.#registers[x] = (this.#registers[x] ?? 0) % this.#value(y);
        break;
      case "rcv":
        this.#recv(x);
        break;
      case "jgz":
        if (this.#value(x) > 0) {
          this.#pc += this.#value(y) - 1;
        }
        break;
      default:
        throw new Error(`Unknown instruction: ${op}`);
    }
  }
}

export default createSolverWithLineArray(async (input) => {
  const cpu = new DuetCPU(input);

  // Keep ticking until recv, storing the last value sent
  let lastValueSent = -1;
  while (!cpu.waiting) {
    const value = cpu.tick();
    if (value !== undefined) {
      lastValueSent = value;
    }
  }

  // Run two CPUs in parallel, sending values between them
  // when both are done or deadlocked, we check how many times
  // cpuB sent a value
  const cpuA = new DuetCPU(input, 0);
  const cpuB = new DuetCPU(input, 1);
  let sends = 0;
  while (true) {
    while (!cpuA.waiting) {
      const value = cpuA.tick();
      if (value !== undefined) {
        cpuB.receive(value);
      }
    }

    while (!cpuB.waiting) {
      const value = cpuB.tick();
      if (value !== undefined) {
        sends++;
        cpuA.receive(value);
      }
    }

    if ((cpuA.waiting || cpuA.done) && (cpuB.waiting || cpuB.done)) {
      break;
    }
  }

  return {
    first: lastValueSent,
    second: sends,
  };
});
