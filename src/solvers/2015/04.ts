import { createSolverWithString } from "../../solution";
import { hash } from "node:crypto";

export default createSolverWithString(async (input) => {
  let first = 0;
  let second = 0;

  let i = 0;

  while (true) {
    const h = hash("md5", input + i);
    if (h.startsWith("00000") && first === 0) {
      first = i;
    }

    if (h.startsWith("000000")) {
      second = i;
      break;
    }

    i++;
  }

  return {
    first,
    second,
  };
});
