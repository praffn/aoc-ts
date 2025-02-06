import { range, sum } from "../../lib/iter";
import { createSolverWithString } from "../../solution";

function step(fish: Array<number>): Array<number> {
  const newFish = new Array(9).fill(0);

  for (let i = 0; i < fish.length; i++) {
    if (i === 0) {
      // all fish at index 0 will spawn a new fish at index 8
      newFish[8] += fish[i];
      // and they will then reset to index 6
      newFish[6] += fish[i];
    } else {
      // All other fish will just move one index down
      newFish[i - 1] += fish[i];
    }
  }

  return newFish;
}

/**
 * Returns an array of fish where the index is represents how many days the fish
 * have left until it will spawn a new fish, and the value at the index is the
 * number of fish that have that many days left.
 *
 * Eg for the fishes: 3, 4, 5, 1, 1, 4, 1
 * The result would be: [0, 3, 0, 1, 2, 1, 0, 0, 0]
 */
function parse(input: string): Array<number> {
  const fish = new Array(9).fill(0);

  for (const f of input.split(",")) {
    fish[+f] += 1;
  }

  return fish;
}

export default createSolverWithString(async (input) => {
  const fish = parse(input);

  return {
    first: sum(range(80).reduce((fish) => step(fish), fish)),
    second: sum(range(256).reduce((fish) => step(fish), fish)),
  };
});
