import { counter, sum } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

type Bid = {
  hand: string;
  bid: number;
};

function parse(input: Array<string>): Array<Bid> {
  return input.map((line) => {
    const [hand, bid] = line.split(" ");
    return {
      hand,
      bid: +bid,
    };
  });
}

/**
 * Returns the numeric value of a hand type:
 *
 * - 1: High card
 * - 2: One pair
 * - 3: Two pair
 * - 4: Three of a kind
 * - 5: Full house
 * - 6: Four of a kind
 * - 7: Five of a kind
 */
function getHandType(hand: string) {
  // Lets get the count of every type of card in hand
  const cardCounts = counter(hand);
  // In part 2 jokers are X. Lets figure out how many we have of those.
  let jokers = cardCounts.get("X") ?? 0;
  // And remove them from the count
  cardCounts.delete("X");

  // Now we're gonna create sorted array of the counts. We don't care about
  // the actual card values, just how many of each we have.
  let counts =
    jokers === 5 ? [0] : Array.from(cardCounts.values()).sort((a, b) => a - b);

  // If we had jokers (for part 2) we add those to the most common card count,
  // which is always the best strategy
  counts[counts.length - 1] += jokers;

  // Now we can figure out our hand type:
  const mostCommonCardCount = counts.at(-1)!;
  const secondMostCommonCardCount = counts.at(-2) ?? 0;

  if (mostCommonCardCount === 5) {
    // Five of a kind
    return 7;
  }

  if (mostCommonCardCount === 4) {
    // Four of a kind
    return 6;
  }

  if (mostCommonCardCount === 3 && secondMostCommonCardCount === 2) {
    // Full house
    return 5;
  }

  if (mostCommonCardCount === 3) {
    // Three of a kind
    return 4;
  }

  if (mostCommonCardCount === 2 && secondMostCommonCardCount === 2) {
    // Two pair
    return 3;
  }

  if (mostCommonCardCount === 2) {
    // One pair
    return 2;
  }

  // High card
  return 1;
}

/**
 * Compares the hand types, in ascending order.
 */
function compareHandTypes(a: string, b: string) {
  const aType = getHandType(a);
  const bType = getHandType(b);

  return aType - bType;
}

const CARD_VALUES = "X23456789TJQKA";
/**
 * Compares card values in ascending order.
 */
function compareCardValues(a: string, b: string) {
  for (let i = 0; i < a.length; i++) {
    const aValue = CARD_VALUES.indexOf(a[i]);
    const bValue = CARD_VALUES.indexOf(b[i]);

    const diff = aValue - bValue;
    if (diff !== 0) {
      return diff;
    }
  }

  return 0;
}

/**
 * Compares two bids in ascending order
 */
function compareBids(a: Bid, b: Bid) {
  const typeDiff = compareHandTypes(a.hand, b.hand);
  if (typeDiff !== 0) {
    return typeDiff;
  }

  return compareCardValues(a.hand, b.hand);
}

/**
 * Returns the total winnings for all the bids
 */
function getTotalWinnings(bids: Array<Bid>, withJoker: boolean) {
  if (withJoker) {
    bids = bids.map((bid) => ({
      // In part 2 X is a "special" card that can be used as a joker
      hand: bid.hand.replaceAll("J", "X"),
      bid: bid.bid,
    }));
  }

  // Sort the bids in ascending order
  const sortedBids = bids.toSorted(compareBids);

  // And return the sum of the product of the bid and the position in the
  // sorted array
  return sum(sortedBids.map((bid, i) => bid.bid * (i + 1)));
}

export default createSolverWithLineArray(async (input) => {
  const bids = parse(input);

  return {
    first: getTotalWinnings(bids, false),
    second: getTotalWinnings(bids, true),
  };
});
