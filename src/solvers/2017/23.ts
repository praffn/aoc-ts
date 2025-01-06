import { createSolverWithLineArray } from "../../solution";

// is this too hacky? thanks https://www.reddit.com/r/adventofcode/comments/7lms6p/comment/drnjld2
export default createSolverWithLineArray(async (input) => {
  const firstNumber = Number.parseInt(input[0].split(" ")[2]);

  const loops = (firstNumber - 2) ** 2;

  const x = firstNumber * 100 + 100_000;
  let nonPrimes = 0;
  for (let n = x; n <= x + 17000; n += 17) {
    let d = 2;
    while (n % d !== 0) {
      d++;
    }
    if (n !== d) {
      nonPrimes++;
    }
  }

  return {
    first: loops,
    second: nonPrimes,
  };
});
