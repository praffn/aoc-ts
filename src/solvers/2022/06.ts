import { enumerate, slidingWindow } from "../../lib/iter";
import { createSolverWithString } from "../../solution";

/**
 * Returns the first index of the character that causes it and the `windowSize`
 * previous characters to be unique.
 */
function findFirstNonRepeat(input: string, windowSize: number) {
  // lets enumerate over a sliding window of the input
  // `i` will be the index of the first character in the window
  // so to get the last index of the last character we just add `windowSize`
  for (const [i, cs] of enumerate(slidingWindow(input, windowSize))) {
    // if a set of the values in the window has the same length as the window
    // then all the characters are unique
    if (new Set(cs).size === windowSize) {
      return i + windowSize;
    }
  }

  return -1;
}

export default createSolverWithString(async (input) => {
  return {
    first: findFirstNonRepeat(input, 4),
    second: findFirstNonRepeat(input, 14),
  };
});
