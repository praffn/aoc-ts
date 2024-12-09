import { createSolverWithLineArray } from "../../solution";

class Computer {
  a = 0;
  b = 0;

  instructions: Array<[opcode: string, op1: string, op2: string]> = [];

  ip = 0;

  public loadProgram(
    program: Array<[opcode: string, op1: string, op2: string]>
  ) {
    this.instructions = program;
  }

  run() {
    while (this.ip < this.instructions.length) {
      const [opcode, op1, op2] = this.instructions[this.ip];
      const register = op1 as "a" | "b";

      switch (opcode) {
        case "hlf":
          this[register] = Math.floor(this[register] / 2);
          this.ip++;
          break;
        case "tpl":
          this[register] *= 3;
          this.ip++;
          break;
        case "inc":
          this[register]++;
          this.ip++;
          break;
        case "jmp":
          this.ip += parseInt(op1);
          break;
        case "jie":
          if (this[register] % 2 === 0) {
            this.ip += parseInt(op2);
          } else {
            this.ip++;
          }
          break;
        case "jio":
          if (this[register] === 1) {
            this.ip += parseInt(op2);
          } else {
            this.ip++;
          }
          break;
        default:
          throw new Error(`Unknown opcode: ${opcode}`);
      }
    }
  }
}

export default createSolverWithLineArray(async (input) => {
  const computer = new Computer();

  const program = input.map((line) => {
    const [opcode, op1, op2] = line.split(" ");
    return [opcode, op1.replace(",", ""), op2] as [string, string, string];
  });

  computer.loadProgram(program);

  computer.run();
  const first = computer.b;

  computer.a = 1;
  computer.b = 0;
  computer.ip = 0;

  computer.run();
  const second = computer.b;

  return {
    first,
    second,
  };
});
