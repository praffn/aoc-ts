import { count, range } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

type Instruction = {
  write: number;
  move: number;
  next: string;
};

type State = [zero: Instruction, one: Instruction];

function parseState(input: Array<string>): [string, State] {
  const name = input[0].split(" ")[2].replace(":", "");
  const state: State = [
    {
      write: Number.parseInt(input[2].trim().split(" ")[4].replace(".", "")),
      move: input[3].includes("right") ? 1 : -1,
      next: input[4].trim().split(" ")[4].replace(".", ""),
    },
    {
      write: Number.parseInt(input[6].trim().split(" ")[4].replace(".", "")),
      move: input[7].includes("right") ? 1 : -1,
      next: input[8].trim().split(" ")[4].replace(".", ""),
    },
  ];

  return [name, state];
}

export default createSolverWithLineArray(async (input) => {
  let currentState = input[0].split(" ")[3].replace(".", "");
  const steps = Number.parseInt(input[1].split(" ")[5]);
  const states: Record<string, State> = {};

  for (const i of range(3, input.length - 1, 10)) {
    const [name, state] = parseState(input.slice(i, i + 10));
    states[name] = state;
  }

  let position = 0;
  const tape = new Map<number, number>();
  for (const _ of range(steps)) {
    const state = states[currentState];
    const value = tape.get(position) ?? 0;
    const instruction = state[value];
    tape.set(position, instruction.write);
    position += instruction.move;
    currentState = instruction.next;
  }

  const ones = count(tape.values().filter((v) => v === 1));

  return {
    first: ones,
    second: "Merry Christmas! 🎅",
  };
});
