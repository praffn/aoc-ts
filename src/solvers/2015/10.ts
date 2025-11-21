import { createSolverWithString } from "../../solution";

export function lookAndSay(input: Uint8Array, rounds: number) {
  let current = new Uint8Array(input);

  let maxLen = input.length * 4;
  let next = new Uint8Array(maxLen);

  for (let r = 0; r < rounds; r++) {
    let write = 0;
    let i = 0;

    while (i < current.length) {
      const ch = current[i];
      let count = 1;

      while (i + count < current.length && current[i + count] === ch) {
        count++;
      }

      next[write++] = 48 + count;
      next[write++] = ch;

      i += count;
    }

    current = next.subarray(0, write);
    next = new Uint8Array(write * 2);
  }

  return current;
}

export default createSolverWithString(async (input) => {
  const bytes = new Uint8Array([...input].map((c) => c.charCodeAt(0)));
  const after40rounds = lookAndSay(bytes, 40);
  const after50rounds = lookAndSay(after40rounds, 10);

  return {
    first: after40rounds.length,
    second: after50rounds.length,
  };
});
