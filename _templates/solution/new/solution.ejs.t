---
to: src/solvers/<%= year %>/<%= day.toString().padStart(2, '0') %>.ts
---

import { createSolver } from "../../solution";

export default createSolver(async (input) => {
  for await (const line of input) {
    // console.log(line);
  }

  return {
    first: 0,
    second: 0,
  };
});