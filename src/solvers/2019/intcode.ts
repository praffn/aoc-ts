export type Memory = Array<number>;

export function makeMemory(input: string): Memory {
  return input.split(",").map((x) => parseInt(x, 10));
}

export function copyMemory(memory: Memory): Memory {
  return memory.slice();
}

export function setMemory(memory: Memory, addr: number, value: number) {
  memory[addr] = value;
}

export function getMemory(memory: Memory, addr: number): number {
  return memory[addr];
}

export function run(memory: Memory) {
  let ip = 0;
  while (ip < memory.length) {
    const opcode = memory[ip];
    switch (opcode) {
      case 1:
        memory[memory[ip + 3]] =
          memory[memory[ip + 1]] + memory[memory[ip + 2]];
        ip += 4;
        break;
      case 2:
        memory[memory[ip + 3]] =
          memory[memory[ip + 1]] * memory[memory[ip + 2]];
        ip += 4;
        break;
      case 99:
        return memory;
      default:
        throw new Error(`Invalid opcode: ${opcode}`);
    }
  }
}
