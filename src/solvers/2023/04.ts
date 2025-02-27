import { range, sum } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

type Card = {
  winningNumbers: Array<number>;
  numbers: Array<number>;
};

function parseCard(line: string): Card {
  const [left, right] = line.split(" | ");
  const winningNumbers = left
    .match(/\d+/g)!
    .slice(1) // <- skip first number (index)
    .map((n) => +n);
  const numbers = right.match(/\d+/g)!.map((n) => +n);

  return { winningNumbers, numbers };
}

/**
 * Returns the number of numbers that match the winning numbers
 */
function getMatches(card: Card) {
  let matches = 0;
  for (const number of card.numbers) {
    if (card.winningNumbers.includes(number)) {
      matches++;
    }
  }
  return matches;
}

/**
 * Returns the total sum of the score of each card
 */
function solveFirst(cards: Array<Card>) {
  let score = 0;
  for (const card of cards) {
    const matches = getMatches(card);
    score += Math.floor(2 ** (matches - 1));
  }

  return score;
}

/**
 * Returns the final total amount of cards that were processed
 */
function solveSecond(cards: Array<Card>) {
  // cardCounts is how many cards we have at each index, initially 1 for all
  const cardCounts = cards.map((_) => 1);

  // now lets go through each card
  for (const [i, card] of cards.entries()) {
    const matches = getMatches(card);
    // and lets increment the card count for the next `matches` cards by how
    // many cards we have at this index
    for (const j of range(matches)) {
      cardCounts[i + j + 1] += cardCounts[i];
    }
  }

  // now just sum up our counts
  return sum(cardCounts);
}

export default createSolverWithLineArray(async (input) => {
  const cards = input.map(parseCard);

  return {
    first: solveFirst(cards),
    second: solveSecond(cards),
  };
});
