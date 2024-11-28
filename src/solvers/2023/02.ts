import { createSolver } from "../../solution";

interface Game {
  id: number;
  sets: Array<Map<string, number>>;
}

function parseGame(input: string): Game {
  let [idPart, rest] = input.split(": ");
  let [_, idStr] = idPart.split(" ");
  const id = Number.parseInt(idStr, 10);

  const sets = [];
  const rawSets = rest.split("; ");

  for (const rawSet of rawSets) {
    const set = new Map<string, number>();
    const picks = rawSet.split(", ");

    for (const pick of picks) {
      const [countStr, color] = pick.split(" ");
      const count = Number.parseInt(countStr, 10);
      set.set(color, count);
    }

    sets.push(set);
  }

  return {
    id,
    sets,
  };
}

export default createSolver(async (input) => {
  // Maximum number of each color for a possible game
  const maxSet = new Map([
    ["red", 12],
    ["green", 13],
    ["blue", 14],
  ]);

  let first = 0;
  let second = 0;

  for await (const line of input) {
    const game = parseGame(line);

    let isPossible = true;

    // this map keeps track of the highest count of each color that was picked in the game
    const max = new Map<string, number>();

    for (const set of game.sets) {
      for (const [color, count] of set.entries()) {
        // update the max count of each color
        max.set(color, Math.max(count, max.get(color) ?? 0));

        if (isPossible && count > (maxSet.get(color) ?? Infinity)) {
          // since this set requires a higher count of this color than the maximum possible, the game is not possible
          isPossible = false;
        }
      }
    }

    if (isPossible) {
      first += game.id;
    }

    // the power of a game is the product of the highest count of each color that was picked in the game
    let power = 1;
    for (const count of max.values()) {
      power *= count;
    }

    second += power;
  }

  return {
    first,
    second,
  };
});
