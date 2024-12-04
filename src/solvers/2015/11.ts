import { slidingWindow } from "../../lib/iter";
import { createSolverWithString } from "../../solution";

const MIN_CHAR_CODE = "a".charCodeAt(0);
const MAX_CHAR_CODE = "z".charCodeAt(0);

const ILLEGAL_CHAR_CODES = ["i", "o", "l"].map((c) => c.charCodeAt(0));

// assumption: input is a string of lowercase letters
function stringToCharCodes(input: string): Array<number> {
  return input.split("").map((c) => c.charCodeAt(0));
}

function charCodesToString(input: Array<number>): string {
  return input.map((c) => String.fromCharCode(c)).join("");
}

function increment(n: number): number {
  if (n === MAX_CHAR_CODE) {
    return MIN_CHAR_CODE;
  }

  return n + 1;
}

function containsStraight(charCodes: Array<number>): boolean {
  for (let i = 0; i < charCodes.length - 2; i++) {
    if (
      charCodes[i] + 1 === charCodes[i + 1] &&
      charCodes[i + 1] + 1 === charCodes[i + 2]
    ) {
      return true;
    }
  }

  return false;
}

function firstIllegalIndex(charCodes: Array<number>): number {
  for (let i = 0; i < charCodes.length; i++) {
    if (ILLEGAL_CHAR_CODES.includes(charCodes[i])) {
      return i;
    }
  }

  return -1;
}

function incrementCharCodes(charCodes: Array<number>): void {
  for (let i = charCodes.length - 1; i >= 0; i--) {
    charCodes[i] = increment(charCodes[i]);

    if (charCodes[i] !== MIN_CHAR_CODE) {
      break;
    }
  }
}

function pairs(charCodes: Array<number>): number {
  const pairs = new Set<number>();

  for (const pair of slidingWindow(charCodes, 2)) {
    if (pair[0] === pair[1]) {
      pairs.add(pair[0]);
    }
  }

  return pairs.size;
}

function findNextPassword(password: string): string {
  const charCodes = stringToCharCodes(password);

  incrementCharCodes(charCodes);

  while (true) {
    // Test for illegal characters.
    // If found increment the index of the first illegal character  and reset
    // remaining part of the password to the minimum character code.
    const illegalIndex = firstIllegalIndex(charCodes);
    if (illegalIndex !== -1) {
      charCodes[illegalIndex] = increment(charCodes[illegalIndex]);
      charCodes.fill(MIN_CHAR_CODE, illegalIndex + 1);
      continue;
    }

    // Must contain a straight of tree letter e.g. 'abc', 'bcd', 'cde'
    if (!containsStraight(charCodes)) {
      incrementCharCodes(charCodes);
      continue;
    }

    // Must contain at least two non-overlapping pairs of letters
    if (pairs(charCodes) < 2) {
      incrementCharCodes(charCodes);
      continue;
    }

    break;
  }

  return charCodesToString(charCodes);
}

export default createSolverWithString(async (input) => {
  const first = findNextPassword(input);
  const second = findNextPassword(first);

  return {
    first: first,
    second: second,
  };
});
