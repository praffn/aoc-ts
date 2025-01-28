import { chunkWhile, count } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

export default createSolverWithLineArray(async (input) => {
  let anyAnswers = 0;
  let allAnswers = 0;

  // go through each group of answers
  for (const group of chunkWhile(input, (line) => line !== "")) {
    // create a map that represents an answer and how many times it was answered
    const answerCount = new Map<string, number>();
    // go through each person's answers
    for (const answers of group) {
      // count each answer
      for (const answer of answers) {
        answerCount.set(answer, (answerCount.get(answer) ?? 0) + 1);
      }
    }

    // count the number of answers that were answered by at least one person
    anyAnswers += answerCount.size;
    // count the number of answers that were answered by all people
    allAnswers += count(
      answerCount.values().filter((count) => count === group.length)
    );
  }

  return {
    first: anyAnswers,
    second: allAnswers,
  };
});
