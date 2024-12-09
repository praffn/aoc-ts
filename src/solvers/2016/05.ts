import { createSolverWithString } from "../../solution";
import { hash } from "node:crypto";

export default createSolverWithString(async (input) => {
  const firstPassword: Array<string> = [];
  const secondPassword: Array<string | null> = Array.from(
    { length: 8 },
    () => null
  );

  let i = 0;
  while (true) {
    const h = hash("md5", input + i);
    if (h.startsWith("00000")) {
      if (firstPassword.length < 8) {
        firstPassword.push(h[5]);
      }

      const pos = Number.parseInt(h[5], 10);
      if (pos < 8 && secondPassword[pos] === null) {
        secondPassword[pos] = h[6];
      }

      if (
        firstPassword.length === 8 &&
        secondPassword.every((c) => c !== null)
      ) {
        break;
      }
    }
    i++;
  }

  return {
    first: firstPassword.join(""),
    second: secondPassword.join(""),
  };
});
