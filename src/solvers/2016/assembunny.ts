function isRegister(s: string) {
  return ["a", "b", "c", "d"].includes(s);
}
export class AssemBunnyCPU {
  registers: Record<string, number> = {
    a: 0,
    b: 0,
    c: 0,
    d: 0,
  };

  instructions: Array<Array<string>> = [];
  ip = 0;
  toggles: Set<number> = new Set();

  constructor(instructions: Array<Array<string>>) {
    this.instructions = instructions;
  }

  parseOperand(operand: string) {
    if (isRegister(operand)) {
      return this.registers[operand];
    }

    return Number.parseInt(operand, 10);
  }

  cpy(x: string, y: string) {
    this.registers[y] = this.parseOperand(x);
    this.ip++;
  }

  optimizeMul(x: string) {
    // we check if the previous and the next few following instructions are
    // the pattern:
    // cpy b c
    // inc a
    // dec c
    // jnz c -2
    // dec d
    // jnz d -5
    // in that case we can optimize it to:
    // a += b * d
    // c = 0
    // b = 0

    if (!isRegister(x)) {
      return false;
    }

    if (this.ip + 3 >= this.instructions.length || this.ip - 1 < 0) {
      return false;
    }

    if (this.instructions[this.ip - 1][0] !== "cpy") {
      return false;
    }

    if (this.instructions[this.ip + 1][0] !== "dec") {
      return false;
    }

    if (this.instructions[this.ip + 2][0] !== "jnz") {
      return false;
    }

    if (this.instructions[this.ip + 3][0] !== "dec") {
      return false;
    }

    if (this.instructions[this.ip + 4][0] !== "jnz") {
      return false;
    }

    const [, copySource, copyDest] = this.instructions[this.ip - 1];
    const dec1Operand = this.instructions[this.ip + 1][1];
    const [, jnz1Operand, jnz1Offset] = this.instructions[this.ip + 2];
    const dec2Operand = this.instructions[this.ip + 3][1];
    const [, jnz2Operand, jnz2Offset] = this.instructions[this.ip + 4];

    if (
      copyDest !== dec1Operand ||
      dec1Operand !== jnz1Operand ||
      dec2Operand !== jnz2Operand ||
      jnz1Offset !== "-2" ||
      jnz2Offset !== "-5"
    ) {
      return false;
    }

    this.registers[x] +=
      this.parseOperand(copySource) * this.parseOperand(dec2Operand);
    this.registers[dec1Operand] = 0;
    this.registers[dec2Operand] = 0;
    this.ip += 5;

    return true;
  }

  inc(x: string) {
    if (this.optimizeMul(x)) {
      return;
    }

    this.registers[x]++;
    this.ip++;
  }

  dec(x: string) {
    this.registers[x]--;
    this.ip++;
  }

  jnz(x: string, y: string) {
    if (this.registers[x] !== 0) {
      this.ip += this.parseOperand(y);
    } else {
      this.ip++;
    }
  }

  tgl(x: string) {
    const offset = this.parseOperand(x);
    const target = this.ip + offset;
    this.toggles.add(target);
    this.ip++;
  }

  mul(x: string, y: string, a: string) {
    this.registers[a] += this.registers[x] * this.registers[y];
    this.registers[x] = 0;
    this.registers[y] = 0;
    this.ip++;
  }

  run() {
    while (this.ip < this.instructions.length) {
      const [op, x, y, z] = this.instructions[this.ip];
      const toggled = this.toggles.has(this.ip);
      switch (op) {
        case "cpy":
          if (!toggled) {
            this.cpy(x, y);
          } else {
            this.jnz(x, y);
          }
          break;
        case "inc":
          if (!toggled) {
            this.inc(x);
          } else {
            this.dec(x);
          }
          break;
        case "dec":
          if (!toggled) {
            this.dec(x);
          } else {
            this.inc(x);
          }
          break;
        case "jnz":
          if (!toggled) {
            this.jnz(x, y);
          } else {
            this.cpy(x, y);
          }
          break;
        case "tgl":
          if (!toggled) {
            this.tgl(x);
          } else {
            this.inc(x);
          }
          break;
        default:
          throw new Error("unknown instruction: " + op);
      }
    }
  }

  reset() {
    this.registers = {
      a: 0,
      b: 0,
      c: 0,
      d: 0,
    };
    this.ip = 0;
  }
}
