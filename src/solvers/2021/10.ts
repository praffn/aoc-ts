import { createSolverWithLineArray } from "../../solution";

// Just some helper stuff
// Maps open brackets to their corresponding closing brackets
const brackets = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">",
} as Record<string, string>;

// Maps a bracket to its score.
// Close brackets are used for syntax error scores
// Open brackets are used for autocomplete scores
const bracketPoints = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
  "(": 1,
  "[": 2,
  "{": 3,
  "<": 4,
} as Record<string, number>;

const openBrackets = Object.keys(brackets);
const closeBrackets = Object.values(brackets);
function isBracketMatch(open: string, close: string) {
  return brackets[open] === close;
}

/**
 * Evaluates the string.
 * If at any point the a wrong closing bracket is encountered, the function will
 * stop and return the syntax error score along with the stack of brakcets up
 * until the point.
 *
 * If no errors are encountered, the function will return 0 as the error score,
 * and the stack of brackets at the end.
 */
function evaluate(line: string): [number, Array<string>] {
  const stack: Array<string> = [];

  for (const c of line) {
    if (openBrackets.includes(c)) {
      stack.push(c);
    } else if (closeBrackets.includes(c)) {
      const last = stack.pop()!;
      if (!isBracketMatch(last, c)) {
        return [bracketPoints[c], stack];
      }
    }
  }

  return [0, stack];
}

/**
 * Calculates and returns a pair of scores.
 * The first score is the syntax error score, which is the sum of the error
 * scores for the lines with mismatching open/close brackets.
 *
 * The second score is the middle score of the sorted scores of the incomplete
 * lines.
 */
function solve(input: Array<string>): [number, number] {
  let syntaxErrorScore = 0;
  let autocompleteScores: Array<number> = [];

  // Lets go through all lines
  for (const line of input) {
    // Lets get our error score and the stack (of brackets)
    const [errorScore, stack] = evaluate(line);

    if (errorScore === 0) {
      // If error score was 0, it means our line was not corrupt, merely
      // incomplete. Lets calculate the score by iterating the brackets stack
      // in reverse and finding the score for each type of bracket
      let autocompleteScore = 0;
      for (const bracket of stack.reverse()) {
        autocompleteScore *= 5;
        autocompleteScore += bracketPoints[bracket];
      }
      // Push that to the autocomplete scores array
      autocompleteScores.push(autocompleteScore);
    } else {
      // This means the line was corrupt. Just add the error score to the total
      syntaxErrorScore += errorScore;
    }
  }

  // Sort the scores and get the middle score. We are guaranteed to have an odd
  // number of scores.
  const middleScore = autocompleteScores.sort((a, b) => a - b)[
    Math.floor(autocompleteScores.length / 2)
  ];

  return [syntaxErrorScore, middleScore];
}

export default createSolverWithLineArray(async (input) => {
  const [syntaxErrorScore, autocompleteScore] = solve(input);

  return {
    first: syntaxErrorScore,
    second: autocompleteScore,
  };
});
