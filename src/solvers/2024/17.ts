import { createSolverWithLineArray } from "../../solution";

class CPU {
  A;
  B;
  C;

  #IP = 0;
  #instructions: Array<number>;
  output: Array<number> = [];

  constructor(A: bigint, B: bigint, C: bigint, instructions: Array<number>) {
    this.A = A;
    this.B = B;
    this.C = C;
    this.#instructions = instructions;
  }

  run() {
    while (this.#IP < this.#instructions.length) {
      const op = this.#instructions[this.#IP++];
      const operand = this.#instructions[this.#IP++];
      switch (op) {
        case 0:
          this.#adv(operand);
          break;
        case 1:
          this.#bxl(operand);
          break;
        case 2:
          this.#bst(operand);
          break;
        case 3:
          this.#jnz(operand);
          break;
        case 4:
          this.#bxc();
          break;
        case 5:
          this.#out(operand);
          break;
        case 6:
          this.#bdv(operand);
          break;
        case 7:
          this.#cdv(operand);
          break;
        default:
          throw new Error(`Unknown opcode: ${op}`);
      }
    }
  }

  #combo(operand: number) {
    switch (operand) {
      case 0:
      case 1:
      case 2:
      case 3:
        return BigInt(operand);
      case 4:
        return this.A;
      case 5:
        return this.B;
      case 6:
        return this.C;
      default:
        throw new Error(`Unknown combo operand: ${operand}`);
    }
  }

  #adv(operand: number) {
    this.A = this.A / 2n ** this.#combo(operand);
  }

  #bxl(operand: number) {
    this.B ^= BigInt(operand);
  }

  #bst(operand: number) {
    this.B = this.#combo(operand) % 8n;
  }

  #jnz(operand: number) {
    if (this.A !== 0n) {
      this.#IP = operand;
    }
  }

  #bxc() {
    this.B ^= this.C;
  }

  #out(operand: number) {
    this.output.push(Number(this.#combo(operand) % 8n));
  }

  #bdv(operand: number) {
    this.B = this.A / 2n ** this.#combo(operand);
  }

  #cdv(operand: number) {
    this.C = this.A / 2n ** this.#combo(operand);
  }
}

function arrayShallowEquals(a: Array<unknown>, b: Array<unknown>) {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}

export default createSolverWithLineArray(async (input) => {
  const A = BigInt(Number.parseInt(input[0].split(": ")[1]));
  const B = BigInt(Number.parseInt(input[1].split(": ")[1]));
  const C = BigInt(Number.parseInt(input[2].split(": ")[1]));
  const instructionsRaw = input[4].split(": ")[1];
  const instructions = instructionsRaw
    .split(",")
    .map((n) => Number.parseInt(n));

  const cpu = new CPU(A, B, C, instructions);
  cpu.run();
  const first = cpu.output.join(",");

  // second (inspired by https://github.com/michel-kraemer/adventofcode-rust/blob/main/2024/day17/src/main.rs)
  const factors = Array(instructions.length).fill(0n);
  let second = -1;
  while (true) {
    let newA = 0n;
    for (let i = 0; i < factors.length; i++) {
      newA += 8n ** BigInt(i) * factors[i];
    }

    const cpu = new CPU(newA, B, C, instructions);
    cpu.run();
    const output = cpu.output;

    if (arrayShallowEquals(output, instructions)) {
      second = Number(newA);
      break;
    }

    for (let i = instructions.length - 1; i >= 0; i--) {
      if (output.length < 1) {
        factors[i]++;
        break;
      }
      if (output[i] !== instructions[i]) {
        factors[i]++;
        break;
      }
    }
  }

  return {
    first,
    second,
  };
});
