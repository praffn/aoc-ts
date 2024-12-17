import { slidingWindow } from "../../lib/iter";
import { createSolverWithString } from "../../solution";
import { hash } from "node:crypto";

// Returns first character that appears in a triple or undefined if none is found
function findFirstTriple(key: string) {
  for (const [a, b, c] of slidingWindow(key, 3)) {
    if (a === b && b === c) {
      return a;
    }
  }
  return undefined;
}

// Returns true if key contains a quintuple of the given char
function containsQuintupleOf(key: string, char: string) {
  for (const [a, b, c, d, e] of slidingWindow(key, 5)) {
    if (a === char && a === b && b === c && c === d && d === e) {
      return true;
    }
  }
  return false;
}

// Hashes the key 2016 times
function stretch(key: string): string {
  let result = key;
  for (let i = 0; i < 2016; i++) {
    result = hash("md5", result);
  }
  return result;
}

// Checks if any of the characters in the triple of the candidate keys
// appears as a quintuple in the current key. If it does it adds the index
// of the candidate key to the valid keys. Also removes expired candidate keys.
function updateCandidates(
  candidateKeys: Map<string, Set<number>>,
  validKeys: Array<number>,
  hash: string,
  currentIndex: number
) {
  for (const [char, candidateIndices] of candidateKeys) {
    const success = containsQuintupleOf(hash, char);

    for (const index of candidateIndices) {
      if (currentIndex >= index + 1000) {
        candidateIndices.delete(index);
        continue;
      }

      if (success) {
        validKeys.push(index);
        candidateIndices.delete(index);
      }
    }

    if (candidateIndices.size === 0) {
      candidateKeys.delete(char);
    }
  }
}

// Tries to find a triple in the hash and adds it to the candidate keys if it
// succeeds
function updateTriples(
  candidateKeys: Map<string, Set<number>>,
  hash: string,
  currentIndex: number
) {
  const tripleChar = findFirstTriple(hash);
  if (tripleChar) {
    const indices = candidateKeys.get(tripleChar) ?? new Set<number>();
    indices.add(currentIndex);
    candidateKeys.set(tripleChar, indices);
  }
}

function solve(salt: string): [number, number] {
  const validKeys: Array<number> = [];
  const validStretchKeys: Array<number> = [];

  const keyCandidates = new Map<string, Set<number>>();
  const stretchKeyCandidates = new Map<string, Set<number>>();

  let i = 0;

  while (true) {
    const currentHash = hash("md5", `${salt}${i}`);
    const currentStretchHash = stretch(currentHash);

    updateCandidates(keyCandidates, validKeys, currentHash, i);
    updateCandidates(
      stretchKeyCandidates,
      validStretchKeys,
      currentStretchHash,
      i
    );

    if (validKeys.length >= 64 && validStretchKeys.length >= 64) {
      break;
    }

    updateTriples(keyCandidates, currentHash, i);
    updateTriples(stretchKeyCandidates, currentStretchHash, i);

    i++;
  }

  return [validKeys[63], validStretchKeys[63]];
}

export default createSolverWithString(async (salt) => {
  const [first, second] = solve(salt);

  return {
    first,
    second,
  };
});
