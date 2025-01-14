import { createSolverWithLineArray } from "../../solution";
import { run } from "./device";

export default createSolverWithLineArray(async (input) => {
  const first = run(input, [0, 0, 0, 0, 0, 0]);
  const second = run(input, [1, 0, 0, 0, 0, 0]);

  return {
    first: first[0],
    second: second[0],
  };
});
