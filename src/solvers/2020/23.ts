import { createSolverWithString } from "../../solution";

/*
 * This solution is build on the idea of 1-based arrays where the indices
 * represent the cup values, and the values at each index represent the next
 * cup in the circular list.
 *
 * Example:
 *
 * The list [5, 1, 4, 2, 3] would be represented as:
 *
 *    [0, 4, 3, 5, 2, 1]
 *     ^
 *     | Notice the zero here, which should be ignored. It makes the list
 *       1-based instead of 0-based.
 */

/**
 * Plays the game with the given numbers array, starting from the current cup.
 * The game is played for the given number of iterations, and is played in-place.
 */
function play(
  numbers: Uint32Array,
  current: number,
  maxCup: number,
  iterations: number
) {
  for (let i = 0; i < iterations; i++) {
    const next1 = numbers[current];
    const next2 = numbers[next1];
    const next3 = numbers[next2];

    numbers[current] = numbers[next3];

    let destination = current - 1 || maxCup;
    while (
      destination === next1 ||
      destination === next2 ||
      destination === next3
    ) {
      destination = destination - 1 || maxCup;
    }

    numbers[next3] = numbers[destination];
    numbers[destination] = next1;

    current = numbers[current];
  }
}

function solveFirst(input: Array<number>) {
  const maxCup = Math.max(...input);

  // Lets build the circular list, in the manner described at the top
  // of this file
  const numbers = new Uint32Array(maxCup + 1);
  for (let i = 0; i < input.length - 1; i++) {
    numbers[input[i]] = input[i + 1];
  }
  numbers[input[input.length - 1]] = input[0];

  // Play for 100 turns
  play(numbers, input[0], maxCup, 100);

  // Get the result by following the list after cup 1
  let result = "";
  let cup = numbers[1];
  while (cup !== 1) {
    result += cup;
    cup = numbers[cup];
  }

  return result;
}

function solveSecond(input: Array<number>) {
  const maxCup = 1_000_000;

  // Lets build the circular list, in the manner described at the top
  const numbers = new Uint32Array(maxCup + 1);
  for (let i = 0; i < input.length; i++) {
    numbers[input[i]] = input[i + 1];
  }

  if (input.length < maxCup) {
    numbers[input[input.length - 1]] = input.length + 1;
    for (let i = input.length + 1; i < maxCup; i++) {
      numbers[i] = i + 1;
    }
    numbers[maxCup] = input[0];
  } else {
    numbers[input[input.length - 1]] = input[0];
  }

  // Play the game for 10 million turns
  play(numbers, input[0], maxCup, 10_000_000);

  // And return the product of the two cups after cup 1
  const firstCup = numbers[1];
  const secondCup = numbers[firstCup];

  return firstCup * secondCup;
}

export default createSolverWithString(async (input) => {
  const numbers = input.split("").map((n) => Number.parseInt(n));

  return {
    first: solveFirst(numbers),
    second: solveSecond(numbers),
  };
});
