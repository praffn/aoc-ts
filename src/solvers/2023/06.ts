import { numericProduct, zip } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

type Entry = {
  time: number;
  recordDistance: number;
};

/**
 * Returns an array of all entries as well as the "super" entry, i.e the
 * entry where time and record distance is the concatenation of all entries.
 */
function parse(input: Array<string>): [Array<Entry>, Entry] {
  const times = input[0].match(/\d+/g)!;
  const recordDistances = input[1].match(/\d+/g)!;

  const entries = zip(
    times.map((n) => +n),
    recordDistances.map((n) => +n)
  ).map(([time, recordDistance]) => ({
    time,
    recordDistance,
  }));

  const superEntry: Entry = {
    time: +times.reduce((a, b) => a + b),
    recordDistance: +recordDistances.reduce((a, b) => a + b),
  };

  return [Array.from(entries), superEntry];
}

/**
 * Returns the number of ways you could win the race by holding down the button
 * for a certain amount of time.
 */
function countWaysToWin(entry: Entry) {
  // We're gonna do 2x binary search
  // First we will find the first time we can win
  // Then we will find the last time we can win
  // The difference between the two is the number of ways we can win

  let lo = 0;
  let hi = entry.time;

  // Lets find the first winnable time
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const distance = mid * (entry.time - mid);
    if (distance > entry.recordDistance) {
      hi = mid;
    } else {
      lo = mid + 1;
    }
  }

  const first = lo;
  hi = entry.time;

  // Lets find the last winnable time
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    const distance = mid * (entry.time - mid);
    if (distance > entry.recordDistance) {
      lo = mid;
    } else {
      hi = mid - 1;
    }
  }

  const last = lo;

  return last - first + 1;
}

export default createSolverWithLineArray(async (input) => {
  const [entries, superEntry] = parse(input);

  return {
    first: numericProduct(entries.map(countWaysToWin)),
    second: countWaysToWin(superEntry),
  };
});
