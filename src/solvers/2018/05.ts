import { createSolverWithString } from "../../solution";

function toCharCodes(s: Array<string>) {
  return new Uint8Array(s.map((c) => c.charCodeAt(0)));
}

function react(polymer: Uint8Array): Uint8Array {
  const stack = new Uint8Array(polymer.length);
  let stackPointer = 0;

  for (let i = 0; i < polymer.length; i++) {
    const unit = polymer[i];

    if (stackPointer > 0 && (stack[stackPointer - 1] ^ unit) === 32) {
      stackPointer--;
    } else {
      stack[stackPointer] = unit;
      stackPointer++;
    }
  }

  return stack.slice(0, stackPointer);
}

function findShortestPolymer(input: string) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  let shortest = Infinity;
  for (const c of alphabet) {
    const polymer = input.replace(new RegExp(c, "gi"), "");
    const reacted = react(toCharCodes(polymer.split(""))).length;
    shortest = Math.min(shortest, reacted);
  }

  return shortest;
}

export default createSolverWithString(async (input) => {
  return {
    first: react(toCharCodes(input.split(""))).length,
    second: findShortestPolymer(input),
  };
});
