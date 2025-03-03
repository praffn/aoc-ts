import { slidingWindow, sum } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

type Sequence = Array<number>;

function parse(input: Array<string>): Array<Sequence> {
  return input.map((line) => {
    return line.split(" ").map((n) => +n);
  });
}

// Predicts the next value in the sequence
function predict(sequence: Sequence): number {
  // If every item in the sequence we stop and next value is 0
  if (sequence.every((n) => n === 0)) {
    return 0;
  }

  // Otherwise, we take all the diffs between the numbers in the sequence
  const diffs = slidingWindow(sequence, 2).map(([a, b]) => b - a);
  // And return the sum of the last number in the sequence and the result of
  // recursively predicting the next value in the diffs
  return sequence.at(-1)! + predict(Array.from(diffs));
}

/**
 * Returns the sum of the predicted values of all sequences.
 */
function predictSum(sequences: Array<Sequence>): number {
  return sum(sequences.map(predict));
}

export default createSolverWithLineArray(async (input) => {
  const sequences = parse(input);
  // part 2 (predicting backwards) can simply be done by reversing the sequences
  const reversedSequences = sequences.map((seq) => seq.toReversed());

  return {
    first: predictSum(sequences),
    second: predictSum(reversedSequences),
  };
});
