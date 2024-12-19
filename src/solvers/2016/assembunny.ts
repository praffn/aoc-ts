export class AssemBunnyCPU {
  registers: Record<string, number> = {
    a: 0,
    b: 0,
    c: 0,
    d: 0,
  };

  instructions: Array<Array<string>> = [];
  ip = 0;

  constructor(instructions: Array<Array<string>>) {
    this.instructions = instructions;
  }

  cpy(x: string, y: string) {
    this.registers[y] = ["a", "b", "c", "d"].includes(x)
      ? this.registers[x]
      : Number.parseInt(x, 10);
    this.ip++;
  }

  inc(x: string) {
    this.registers[x]++;
    this.ip++;
  }

  dec(x: string) {
    this.registers[x]--;
    this.ip++;
  }

  jnz(x: string, y: string) {
    if (this.registers[x] !== 0) {
      this.ip += Number.parseInt(y, 10);
    } else {
      this.ip++;
    }
  }

  run() {
    while (this.ip < this.instructions.length) {
      const [op, x, y] = this.instructions[this.ip];
      switch (op) {
        case "cpy":
          this.cpy(x, y);
          break;
        case "inc":
          this.inc(x);
          break;
        case "dec":
          this.dec(x);
          break;
        case "jnz":
          this.jnz(x, y);
          break;
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
