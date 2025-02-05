import { modexp } from "../../lib/math/math";
import { createSolverWithNumberArray } from "../../solution";

const m = 20201227;

/**
 * Returns the loop size for a given public key
 * The loop size is the number of times the subject number must be transformed
 * to get the public key.
 */
function calculateLoopSize(subjectNumber: number, p: number) {
  let loopSize = 0;
  let v = 1;
  while (v !== p) {
    loopSize++;
    v = (subjectNumber * v) % m;
  }

  return loopSize;
}

export default createSolverWithNumberArray(async (input) => {
  const a = input[0];
  const b = input[1];

  const loopSize = calculateLoopSize(7, a);

  return {
    first: modexp(b, loopSize, m),
    second: "🔐 Merry Christmas! 🎅",
  };
});
