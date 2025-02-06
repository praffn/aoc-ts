import { bitSet } from "../../lib/bits";
import { range } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

function findGammaAndEpsilonRating(input: Array<string>): [number, number] {
  const bitLength = input[0].length;

  let gammaRating = 0;

  // loop through each bit, msb -> lsb
  for (const i of range(bitLength)) {
    const ones = input.filter((line) => line[i] === "1");

    // if there are more ones than zeros, set the bit at the current position
    if (ones.length >= input.length / 2) {
      gammaRating = bitSet(gammaRating, bitLength - i - 1);
    }
  }

  // epsilon rating is the inverse of gamma rating
  return [gammaRating, ~gammaRating & ((1 << bitLength) - 1)];
}

function findOxygenGeneratorRating(input: Array<string>) {
  const bitLength = input[0].length;

  // loop through each bit, msb -> lsb
  for (const i of range(bitLength)) {
    // lets get all the lines that have a 1 at the current bit
    const ones = input.filter((line) => line[i] === "1");

    // if the count of ones is greater than or equal to half the input size
    // it means there are more ones than zeros at this bit position,
    // so we can just set the input array to the already filtered values
    if (ones.length >= input.length / 2) {
      input = ones;
    } else {
      // Otherwise, there are more zeroes, so we do the inverse
      input = input.filter((line) => line[i] === "0");
    }

    // Once we have just a single value left we're done
    if (input.length === 1) {
      break;
    }
  }

  return Number.parseInt(input[0], 2);
}

function findCO2ScrubberRating(input: Array<string>) {
  const bitLength = input[0].length;

  // loop through each bit, msb -> lsb
  for (const i of range(bitLength)) {
    // lets get all the lines that have a 1 at the current bit
    const ones = input.filter((line) => line[i] === "1");

    // if the count of ones is less than half the input size it means there
    // are more zeroes than ones at this bit position, so we can just set the
    // input array to the already filtered values
    if (ones.length < input.length / 2) {
      input = ones;
    } else {
      // Otherwise, there are more ones, so we do the inverse
      input = input.filter((line) => line[i] === "0");
    }

    // Once we have just a single value left we're done
    if (input.length === 1) {
      break;
    }
  }

  return Number.parseInt(input[0], 2);
}

export default createSolverWithLineArray(async (input) => {
  const [gammaRating, epsilonRating] = findGammaAndEpsilonRating(input);
  const oxygenGeneratorRating = findOxygenGeneratorRating(input);
  const co2ScrubberRating = findCO2ScrubberRating(input);

  return {
    first: gammaRating * epsilonRating,
    second: oxygenGeneratorRating * co2ScrubberRating,
  };
});
