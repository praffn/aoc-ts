import { createSolverWithString } from "../../solution";
import {
  copyMemory,
  getMemory,
  makeMemory,
  run,
  setMemory,
  type Memory,
} from "./intcode";

function solveFirst(memory: Memory) {
  const memoryCopy = copyMemory(memory);
  setMemory(memoryCopy, 1, 12);
  setMemory(memoryCopy, 2, 2);

  run(memoryCopy);

  return getMemory(memoryCopy, 0);
}

function solveSecond(memory: Memory) {
  for (let noun = 0; noun <= 99; noun++) {
    for (let verb = 0; verb <= 99; verb++) {
      const memoryCopy = copyMemory(memory);
      setMemory(memoryCopy, 1, noun);
      setMemory(memoryCopy, 2, verb);

      run(memoryCopy);

      if (getMemory(memoryCopy, 0) === 19690720) {
        return 100 * noun + verb;
      }
    }
  }

  throw new Error("No solution found");
}

export default createSolverWithString(async (input) => {
  const memory = makeMemory(input);

  return {
    first: solveFirst(memory),
    second: solveSecond(memory),
  };
});
