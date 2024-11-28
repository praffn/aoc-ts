import { createSolverWithLineArray } from "../../solution";

const numbers = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

function isDigit(c: string): boolean {
  return c >= "0" && c <= "9";
}

function findFirstAndLastDigit(input: string): number {
  let first = 0;
  let second = 0;

  for (const c of input) {
    if (isDigit(c)) {
      first = c.charCodeAt(0) - 48;
      break;
    }
  }

  for (let i = input.length - 1; i >= 0; i--) {
    if (isDigit(input[i])) {
      second = input[i].charCodeAt(0) - 48;
      break;
    }
  }

  return first * 10 + second;
}

function findFirstNumber(input: string): number {
  for (let i = 0; i < input.length; i++) {
    if (isDigit(input[i])) {
      return Number.parseInt(input[i], 10);
    }
    const slice = input.slice(i);
    for (const [word, number] of Object.entries(numbers)) {
      if (slice.startsWith(word)) {
        return number;
      }
    }
  }

  throw new Error(`Could not find a number in ${input}`);
}

function findLastNumber(input: string): number {
  for (let i = input.length - 1; i >= 0; i--) {
    if (isDigit(input[i])) {
      return Number.parseInt(input[i], 10);
    }

    const slice = input.slice(i - input.length);

    for (const [word, number] of Object.entries(numbers)) {
      if (slice.startsWith(word)) {
        return number;
      }
    }
  }

  throw new Error(`Could not find a number in ${input}`);
}

export default createSolverWithLineArray(async (input) => {
  const first = input.reduce((acc, line) => {
    return acc + findFirstAndLastDigit(line);
  }, 0);

  const second = input.reduce((acc, line) => {
    const a = findFirstNumber(line);
    const b = findLastNumber(line);
    return a * 10 + b + acc;
  }, 0);

  return {
    first,
    second,
  };
});
