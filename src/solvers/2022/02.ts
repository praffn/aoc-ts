import { sum } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

type Type =
  | 1 // rock
  | 2 // paper
  | 3; // scissors

// The index will beat the value at that index.
// Index 0 is unused
const beats: Array<Type> = [1, 3, 1, 2];
// The index will lose to the value at that index.
// Index 0 is unused
const loses: Array<Type> = [1, 2, 3, 1];

type Round = [Type, Type];

/**
 * Returns the points for the result of the round, plus the value for the
 * hand you chose.
 */
function score([opponent, you]: Round) {
  if (beats[opponent] === you) {
    return you;
  }
  if (beats[you] === opponent) {
    return 6 + you;
  }
  return 3 + you;
}

function parseType(c: string): Type {
  switch (c) {
    case "A":
    case "X":
      return 1;
    case "B":
    case "Y":
      return 2;
    case "C":
    case "Z":
      return 3;
    default:
      throw new Error(`Invalid hand: ${c}`);
  }
}

function parse(input: Array<string>): Array<[Type, Type]> {
  return input.map((line) => {
    const [a, b] = line.split(" ");
    return [parseType(a), parseType(b)];
  });
}

/**
 * Corrects your hand to be the hand that will result in:
 *
 * - X (1): loss
 * - Y (2): draw
 * - Z (3): win
 *
 * Returns a new corrected round.
 */
function correct([opponent, you]: Round): Round {
  switch (you) {
    case 1:
      return [opponent, beats[opponent]];
    case 2:
      return [opponent, opponent];
    case 3:
      return [opponent, loses[opponent]];
  }
}

export default createSolverWithLineArray(async (input) => {
  const guide = parse(input);

  return {
    first: sum(guide.map(score)),
    second: sum(guide.map((round) => score(correct(round)))),
  };
});
