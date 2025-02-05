import { Deque } from "../../lib/collections/deque";
import { sum } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

/**
 * Parses the input into two decks (player 1 and player 2) represented as
 * deques of numbers.
 */
function parse(input: Array<string>): [Deque<number>, Deque<number>] {
  const p1 = new Deque<number>();
  const p2 = new Deque<number>();

  let p = p1;
  for (const line of input.slice(1)) {
    if (line === "") continue;
    if (line === "Player 2:") {
      p = p2;
      continue;
    }

    p.pushBack(Number.parseInt(line, 10));
  }

  return [p1, p2];
}

/**
 * Plays a game of combat between two players.
 * Uses ruleset for part 1
 */
function combat(p1: Deque<number>, p2: Deque<number>): [1 | 2, Deque<number>] {
  // Play until either player has no cards left
  while (!p1.isEmpty() && !p2.isEmpty()) {
    // Get the top card of each player
    const c1 = p1.popFront();
    const c2 = p2.popFront();

    // Winner of the round is the player with the greatest card
    // The winner takes both cards and puts them at the bottom of their deck
    // (They take their own card first, then the other player's card)
    if (c1 > c2) {
      p1.pushBack(c1);
      p1.pushBack(c2);
    } else {
      p2.pushBack(c2);
      p2.pushBack(c1);
    }
  }

  // The player that has cards left is the winner
  return p1.isEmpty() ? [2, p2] : [1, p1];
}

/**
 * Plays a game of recursive combat between two players.
 * Uses ruleset for part 2
 */
function recursiveCombat(
  p1: Deque<number>,
  p2: Deque<number>
): [1 | 2, Deque<number>] {
  // if we see the same configuration of decks, player 1 wins, so we need a set
  // to keep track of seen configurations
  const seen = new Set<string>();

  // Play until either player has no cards left
  while (!p1.isEmpty() && !p2.isEmpty()) {
    // First lets check if we've seen this configuration before
    // If we have, player 1 wins, otherwise we add it to the set and continue
    const p1key = p1.toString(",");
    const p2key = p2.toString(",");
    const key = `${p1key}|${p2key}`;
    if (seen.has(key)) {
      return [1, p1];
    }
    seen.add(key);

    // Get the top card of each player
    const c1 = p1.popFront();
    const c2 = p2.popFront();

    let winner: 1 | 2 = 1;

    if (p1.size >= c1 && p2.size >= c2) {
      // If the amount of cards in both players deck are greater than or equal
      // to the value of the card the the respective player drew, we will play
      // a recursive game with copies of the next n cards of each players deck,
      // where n is the value of the card the player drew
      [winner] = recursiveCombat(p1.slice(0, c1), p2.slice(0, c2));
    } else {
      // Otherwise, it is like the rules for part 1: greatest card wins
      winner = c1 > c2 ? 1 : 2;
    }

    // Same as part 1. Winner takes both cards, with their own card first,
    // putting it at the bottom of their deck
    if (winner === 1) {
      p1.pushBack(c1);
      p1.pushBack(c2);
    } else {
      p2.pushBack(c2);
      p2.pushBack(c1);
    }
  }

  // Winner is the player with cards left
  return p1.isEmpty() ? [2, p2] : [1, p1];
}

/**
 * Plays a game of combat between two players and returns the score of the
 * winning player. Use `combat` for part 1 and `recursiveCombat` for part 2.
 */
function play(
  p1: Deque<number>,
  p2: Deque<number>,
  combat: (p1: Deque<number>, p2: Deque<number>) => [1 | 2, Deque<number>]
): number {
  // find the winning deck
  const [, winnerDeck] = combat(p1.clone(), p2.clone());
  // compute score
  return sum(winnerDeck.map((n, i) => (winnerDeck.size - i) * n));
}

export default createSolverWithLineArray(async (input) => {
  const [p1, p2] = parse(input);

  return {
    first: play(p1, p2, combat),
    second: play(p1, p2, recursiveCombat),
  };
});
