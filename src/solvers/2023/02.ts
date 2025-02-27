import { sum } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

type Set = [red: number, green: number, blue: number];
const colorIndex: Record<string, number> = { red: 0, green: 1, blue: 2 };
type Game = Array<Set>;

function parseGame(line: string): Game {
  const [_, setsRaw] = line.split(": ");

  const game: Game = [];

  for (const setRaw of setsRaw.split("; ")) {
    const set: Set = [0, 0, 0];
    for (const entry of setRaw.split(", ")) {
      const [count, color] = entry.split(" ");
      set[colorIndex[color]] = +count;
    }
    game.push(set);
  }

  return game;
}

/**
 * Returns true if the game is possible, i.e. no set ever pulled more of the
 * available red, green or blue cubes.
 */
function isPossible(game: Game) {
  return game.every(([red, green, blue]) => {
    return red <= 12 && green <= 13 && blue <= 14;
  });
}

/**
 * Returns the sum of all game ids where the game is possible
 */
function sumPossibleGameIds(games: Array<Game>) {
  return sum(games.map((game, i) => (isPossible(game) ? i + 1 : 0)));
}

/**
 * Returns the minimum set of a game, i.e. the set with the lowest possible
 * amount of red, green and blue cubes to make the game possible.
 */
function minimumSet(game: Game): Set {
  let minRed = 0;
  let minGreen = 0;
  let minBlue = 0;
  for (const set of game) {
    minRed = Math.max(minRed, set[0]);
    minGreen = Math.max(minGreen, set[1]);
    minBlue = Math.max(minBlue, set[2]);
  }

  return [minRed, minGreen, minBlue];
}

/**
 * Returns the sum of power of each game's minimum set
 */
function sumMinimumSetPower(games: Array<Game>) {
  let sum = 0;
  for (const game of games) {
    const [minRed, minGreen, minBlue] = minimumSet(game);
    sum += minRed * minGreen * minBlue;
  }
  return sum;
}

export default createSolverWithLineArray(async (input) => {
  const games = input.map(parseGame);

  return {
    first: sumPossibleGameIds(games),
    second: sumMinimumSetPower(games),
  };
});
