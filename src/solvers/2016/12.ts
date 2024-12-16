import { createSolverWithLineArray } from "../../solution";

class CPU {
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

  run() {
    while (this.ip < this.instructions.length) {
      const [op, x, y] = this.instructions[this.ip];
      switch (op) {
        case "cpy":
          this.registers[y] = ["a", "b", "c", "d"].includes(x)
            ? this.registers[x]
            : Number.parseInt(x, 10);
          break;
        case "inc":
          this.registers[x]++;
          break;
        case "dec":
          this.registers[x]--;
          break;
        case "jnz":
          if (this.registers[x] !== 0) {
            this.ip += Number.parseInt(y, 10);
            continue;
          }
          break;
      }
      this.ip++;
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

export default createSolverWithLineArray(async (input) => {
  const instructions = input.map((line) => line.split(" "));
  const cpu = new CPU(instructions);

  cpu.run();
  const first = cpu.registers.a;
  cpu.reset();
  cpu.registers.c = 1;
  cpu.run();
  const second = cpu.registers.a;

  return {
    first,
    second,
  };
});
