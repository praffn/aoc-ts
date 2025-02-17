---
to: src/solvers/<%= year %>/<%= day.toString().padStart(2, '0') %>.ts
---

import { createSolverWithLineArray } from "../../solution";

export default createSolverWithLineArray(async (input) => {
  for (const line of input) {
    console.log(line);
  }

  return {
    first: 0,
    second: 0,
  };
});