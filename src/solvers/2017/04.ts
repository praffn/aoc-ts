import { permutations } from "../../lib/iter";
import { createSolver } from "../../solution";

function isValidPassphrase(passphrase: string, noAnagrams = false) {
  const seen = new Set<string>();

  for (const word of passphrase.split(" ")) {
    if (seen.has(word)) {
      return false;
    }

    seen.add(word);

    if (noAnagrams) {
      for (const anagram of permutations(word)) {
        seen.add(anagram.join(""));
      }
    }
  }
  return true;
}

export default createSolver(async (input) => {
  let first = 0;
  let second = 0;

  for await (const passphrase of input) {
    if (isValidPassphrase(passphrase)) {
      first++;
    }

    if (isValidPassphrase(passphrase, true)) {
      second++;
    }
  }

  return {
    first,
    second,
  };
});
