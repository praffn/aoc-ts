import { createSolverWithLineArray } from "../../solution";

/**
 * Recursively plays a practice game with a deterministic die, returning the
 * losing players score multiplied by the number of die rolls.
 */
function playPracticeGame(
  player1: number,
  player2: number,
  score1 = 0,
  score2 = 0,
  i = 0
): number {
  if (score2 >= 1000) {
    return i * score1;
  }

  player1 = (player1 + 3 * i + 6) % 10 || 10;

  return playPracticeGame(player2, player1, score2, score1 + player1, i + 3);
}

// The Dirac die will roll 3 times every turn, and each roll can be 1, 2 or 3.
// That means the total sum can range from 3 to 9 (1+1+1 to 3+3+3).
// However, some sums are more likely than others. For example, 6 can be rolled
// in 7 different ways, while 3 and 9 can only be rolled in 1 way.
// The below array is a list of all possible roll sums and how many ways they
// can be rolled.
const diracDieRolls = [
  [3, 1],
  [4, 3],
  [5, 6],
  [6, 7],
  [7, 6],
  [8, 3],
  [9, 1],
];

// Cache for the Dirac die game. The key is a comma-separated string of the
// arguments to the function
const cache = new Map<string, [number, number]>();

/**
 * Recursively plays a game of Dirac die between two players, returning a pair
 * of the final scores for each player.
 */
function playDiracDie(
  player1: number,
  player2: number,
  score1 = 0,
  score2 = 0
): [number, number] {
  // lets check in cache
  const key = `${player1},${player2},${score1},${score2}`;
  if (cache.has(key)) {
    return cache.get(key)!;
  }

  // Check for termination conditions
  if (score2 >= 21) {
    return [0, 1];
  }

  // Recursively play the game for all possible rolls
  let player1Wins = 0;
  let player2Wins = 0;
  for (const [sum, freq] of diracDieRolls) {
    // sum is the sum of the three die rolls, freq is the number of ways we
    // can roll that sum.
    const newPlayer1 = (player1 + sum) % 10 || 10;
    const [w2, w1] = playDiracDie(
      player2,
      newPlayer1,
      score2,
      score1 + newPlayer1
    );
    player1Wins += w1 * freq;
    player2Wins += w2 * freq;
  }

  cache.set(key, [player1Wins, player2Wins]);
  return [player1Wins, player2Wins];
}

export default createSolverWithLineArray(async (input) => {
  const player1 = +input[0].at(-1)!;
  const player2 = +input[1].at(-1)!;

  return {
    first: playPracticeGame(player1, player2),
    second: Math.max(...playDiracDie(player1, player2)),
  };
});
