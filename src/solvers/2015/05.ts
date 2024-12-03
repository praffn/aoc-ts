import { slidingWindow } from "../../lib/iter";
import { createSolver } from "../../solution";

function isVowel(c: string) {
  return "aeiou".includes(c);
}

function hasAtLeastThreeVowels(input: string) {
  return input.split("").filter(isVowel).length >= 3;
}

function hasAtLeastOneDoubleLetter(input: string): boolean {
  return slidingWindow(input, 2).some(([a, b]) => a === b);
}

const illegalStrings = ["ab", "cd", "pq", "xy"];
function doesNotContainIllegalString(input: string): boolean {
  return !illegalStrings.some((illegal) => input.includes(illegal));
}

export function isNiceString(input: string): boolean {
  return (
    hasAtLeastThreeVowels(input) &&
    hasAtLeastOneDoubleLetter(input) &&
    doesNotContainIllegalString(input)
  );
}

function containsPairTwice(input: string): boolean {
  for (let i = 0; i < input.length; i++) {
    const pair = input.slice(i, i + 2);
    if (input.slice(i + 2).includes(pair)) {
      return true;
    }
  }

  return false;
}

export function containsLetterBetweenTwoOtherLetters(input: string): boolean {
  return slidingWindow(input, 3).some(([a, _, c]) => a === c);
}

export function isNiceStringStrict(input: string): boolean {
  return (
    containsPairTwice(input) && containsLetterBetweenTwoOtherLetters(input)
  );
}

export default createSolver(async (input) => {
  let first = 0;
  let second = 0;

  for await (const line of input) {
    if (isNiceString(line)) {
      first++;
    }

    if (isNiceStringStrict(line)) {
      second++;
    }
  }

  return {
    first,
    second,
  };
});
