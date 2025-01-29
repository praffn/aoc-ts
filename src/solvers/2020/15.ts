import { createSolverWithString } from "../../solution";

type Game = {
  map: Map<number, number>;
  last: number;
  turn: number;
};

function makeGame(input: string) {
  const numbers = input.split(",").map((n) => Number.parseInt(n));

  let last = numbers.at(-1)!;
  let map = new Map(numbers.map((n, i) => [n, i]));

  return {
    map,
    last,
    turn: numbers.length - 1,
  };
}

function playUntil(game: Game, turn: number) {
  while (game.turn < turn - 1) {
    const newLast = game.turn - (game.map.get(game.last) ?? game.turn);
    game.map.set(game.last, game.turn);
    game.last = newLast;
    game.turn++;
  }

  return game.last;
}

export default createSolverWithString(async (input, _, skipSecond = false) => {
  const game = makeGame(input);

  return {
    first: playUntil(game, 2020),
    second: skipSecond ? "Second skipped" : playUntil(game, 30_000_000),
  };
});
