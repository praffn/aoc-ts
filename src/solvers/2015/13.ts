import { permute } from "../../lib/iter";
import { createSolver } from "../../solution";

function parseLine(line: string): {
  person1: string;
  person2: string;
  happiness: number;
} {
  const parts = line.split(" ");
  const person1 = parts[0];
  const person2 = parts[10]!.replace(".", "");
  const sign = parts[2] === "gain" ? 1 : -1;
  const happiness = sign * Number.parseInt(parts[3], 10);

  return {
    person1,
    person2,
    happiness,
  };
}

function computeMaxHappiness(
  people: Array<string>,
  happinessMap: Map<string, Map<string, number>>
) {
  let maxHappiness = -Infinity;

  const arrangements = permute(people);
  for (const arrangement of arrangements) {
    let totalHappiness = 0;

    for (let i = 0; i < arrangement.length; i++) {
      const person = arrangement[i];
      const left = arrangement.at(i - 1)!;
      const right = arrangement.at((i + 1) % arrangement.length)!;

      const leftHappiness = happinessMap.get(person)!.get(left)!;
      const rightHappiness = happinessMap.get(person)!.get(right)!;

      totalHappiness += leftHappiness + rightHappiness;
    }

    maxHappiness = Math.max(maxHappiness, totalHappiness);
  }

  return maxHappiness;
}

export default createSolver(async (input) => {
  const happinessMap = new Map<string, Map<string, number>>();

  for await (const line of input) {
    const { person1, person2, happiness } = parseLine(line);
    if (!happinessMap.has(person1)) {
      happinessMap.set(person1, new Map());
    }

    happinessMap.get(person1)!.set(person2, happiness);
  }

  const people = Array.from(happinessMap.keys());

  for (const person of people) {
    if (!happinessMap.has("me")) {
      happinessMap.set("me", new Map());
    }

    happinessMap.get("me")!.set(person, 0);
    happinessMap.get(person)!.set("me", 0);
  }

  return {
    first: computeMaxHappiness(people, happinessMap),
    second: computeMaxHappiness(["me", ...people], happinessMap),
  };
});
