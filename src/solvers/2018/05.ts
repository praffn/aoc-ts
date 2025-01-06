import { createSolverWithString } from "../../solution";

function toCharCodes(s: Array<string>) {
  return s.map((c) => c.charCodeAt(0));
}

function react(polymer: Array<number>): Array<number> {
  const newPolymer: Array<number> = [];

  for (let i = 0; i < polymer.length; i++) {
    const unit = polymer[i];
    const nextUnit = polymer[i + 1];

    if (!nextUnit) {
      newPolymer.push(unit);
      break;
    }

    if (Math.abs(unit - nextUnit) === 32) {
      i++;
    } else {
      newPolymer.push(unit);
    }
  }

  if (newPolymer.length === polymer.length) {
    return newPolymer;
  }

  return react(newPolymer);
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
