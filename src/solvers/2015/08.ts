import { createSolver } from "../../solution";

export function countStringLength(s: string): number {
  let count = 0;

  for (let i = 1; i < s.length - 1; i++) {
    if (s[i] === "\\") {
      if (s[i + 1] === "x") {
        i += 2;
        continue;
      }
      i += 1;
    }

    count++;
  }

  return count;
}

function encodedLength(s: string): number {
  let len = 2;

  for (let i = 0; i < s.length; i++) {
    if (s[i] === '"' || s[i] === "\\") {
      len += 2;
    } else {
      len += 1;
    }
  }

  return len;
}

export default createSolver(async (input) => {
  let totalLineLength = 0;
  let totalStringLength = 0;
  let totalEncodedLength = 0;

  for await (const line of input) {
    totalLineLength += line.length;
    totalStringLength += countStringLength(line);
    totalEncodedLength += encodedLength(line);
  }

  return {
    first: totalLineLength - totalStringLength,
    second: totalEncodedLength - totalLineLength,
  };
});
