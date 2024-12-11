import { createSolverWithString } from "../../solution";

function decompressedLength(input: string, v2 = false): number {
  let length = 0;

  let pos = 0;
  while (pos < input.length) {
    if (input[pos] !== "(") {
      length++;
      pos++;
      continue;
    }

    const closeParenIndex = input.indexOf(")", pos);
    const marker = input.slice(pos + 1, closeParenIndex);
    const [count, repeat] = marker
      .split("x")
      .map((n) => Number.parseInt(n, 10));

    const chunkStart = closeParenIndex + 1;
    const chunkEnd = chunkStart + count;
    const chunk = input.slice(chunkStart, chunkEnd);
    if (v2) {
      length += decompressedLength(chunk, true) * repeat;
    } else {
      length += count * repeat;
    }

    pos = chunkEnd;
  }

  return length;
}

export default createSolverWithString(async (input) => {
  return {
    first: decompressedLength(input),
    second: decompressedLength(input, true),
  };
});
