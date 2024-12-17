import { createSolverWithString } from "../../solution";

function solve(input: string, targetLength: number) {
  const buffer = input.split("").map((c) => c === "1");

  while (buffer.length < targetLength) {
    buffer.push(false);
    for (let i = buffer.length - 2; i >= 0; i--) {
      buffer.push(!buffer[i]);
    }
  }

  buffer.length = targetLength;

  while ((buffer.length & 1) === 0) {
    const newBuffer: Array<boolean> = [];
    for (let i = 0; i < buffer.length; i += 2) {
      newBuffer.push(buffer[i] === buffer[i + 1]);
    }
    buffer.length = 0;
    for (let i = 0; i < newBuffer.length; i++) {
      buffer.push(newBuffer[i]);
    }
  }

  return buffer.map((b) => (b ? "1" : "0")).join("");
}

export default createSolverWithString(async (input) => {
  return {
    first: solve(input, 272),
    second: solve(input, 35651584),
  };
});
